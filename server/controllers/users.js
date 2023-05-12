import bcrypt from "bcrypt";
import mongoose from "mongoose";
import User from "../models/User.js";
import View from "../models/View.js";
import EventType from "../models/EventType.js";
import Event from "../models/Event.js";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import { sendEmail } from "../utils/sendEmail.js";

// GOOGLE
export const isConnectedToGoogle = async (req, res) => {
    req.params.user = mongoose.Types.ObjectId(req.params.user);
    const user = await User.findOne({
        _id: req.params.user,
    }).exec();
    if (user.googleTokens) {
        res.status(201).json({ connectedToGoogle: true });
    } else {
        res.status(201).json({ connectedToGoogle: false });
    }
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const unlinkFromGoogle = async (req, res) => {
    const { password } = req.body;
    req.params.user = mongoose.Types.ObjectId(req.params.user);
    const user = await User.findOne({
        _id: req.params.user,
    }).exec();

    if (!user.googleTokens) {
        res.status(201).json({ msg: "No account connected!" });
    }

    user.googleTokens = undefined;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    user.password = passwordHash;
    user.save();

    await sendEmail(
        user.email,
        "Google Account Unlinked",
        { name: `${user.first_name} ${user.last_name}` },
        "./template/unlinkedFromGoogle.handlebars"
    );

    res.status(201).json({ msg: "Unlinked from google" });
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const linkToGoogle = async (req, res) => {
    // Get token
    const tokensResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        body: JSON.stringify({
            code: req.body.googleCode,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: "postmessage",
            grant_type: "authorization_code",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    });
    const tokens = await tokensResponse.json();

    // Get user
    const googleOAuthResponse = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
            },
        }
    );
    const googleOAuth = await googleOAuthResponse.json();

    if (!googleOAuth.verified_email) {
        res.status(403).json({
            error: "Google account is not verified!",
        });
    }

    const {
        given_name: first_name,
        family_name: last_name,
        email,
    } = googleOAuth;

    req.params.user = mongoose.Types.ObjectId(req.params.user);
    const user = await User.findOne({
        _id: req.params.user,
    }).exec();

    if (user.googleTokens) {
        res.status(201).json({ msg: "There is an account connected already!" });
    }

    const userAlreadyExists = await User.findOne({ email: email });
    if (userAlreadyExists && email.toLowerCase() !== user.email.toLowerCase())
        return res.status(400).json({ msg: "Email is already in use!" });

    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.googleTokens = tokens;
    user.password = undefined;

    user.save();

    res.status(201).json({ msg: "Linked to google" });
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getGoogleEvents = async (req, res) => {
    req.params.user = mongoose.Types.ObjectId(req.params.user);
    const user = await User.findOne({
        _id: req.params.user,
    }).exec();
    if (user.googleTokens) {
        const credentials = {
            type: "authorized_user",
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            refresh_token: user.googleTokens.refresh_token,
        };
        const client = google.auth.fromJSON(credentials);
        const calendar = google.calendar({ version: "v3", auth: client });
        const maxDate = (date, days) => {
            let d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        };
        const calendarList = await calendar.calendarList.list({
            minAccessRole: "owner",
            showHidden: false,
        });
        const calendarListResults = calendarList.data.items.map(
            (item) => item.id
        );
        const events = [];
        for (let i = 0; i < calendarListResults.length; i++) {
            const result = await calendar.events.list({
                calendarId: calendarListResults[i],
                timeMin: req.body.date,
                timeMax: maxDate(req.body.date, 7).toISOString(),
                singleEvents: true,
                orderBy: "startTime",
            });
            events.push(result.data.items);
        }
        if (events.length < 1) {
            res.status(201).json({ msg: "No upcoming events!" });
        } else {
            res.status(201).json(events);
        }
        // res.status(201).json(calendarListResults);
    } else {
        res.status(201).json({ msg: "No account connected..." });
    }
    try {
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// USER
export const getUser = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({
            _id: req.params.user,
        }).exec();

        let secureUser = user._doc;
        delete secureUser.googleTokens;
        delete secureUser.password;

        res.status(201).json(secureUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteUser = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);

        const user = await User.findOne({
            _id: req.params.user,
        }).exec();

        await sendEmail(
            user.email,
            "Goodbye! ;(",
            { name: `${user.first_name} ${user.last_name}` },
            "./template/deletedAccount.handlebars"
        );

        await user.deleteOne();

        await EventType.deleteMany({
            owner_id: req.params.user,
        });
        await View.deleteMany({
            owner_id: req.params.user,
        });
        await Event.deleteMany({
            owner_id: req.params.user,
        });

        res.status(201).json("User Deleted!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateName = async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({
            _id: req.params.user,
        }).exec();

        user.first_name = first_name;
        user.last_name = last_name;
        user.save();

        res.status(201).json("Updated name!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updatePass = async (req, res) => {
    try {
        const { password } = req.body;
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({
            _id: req.params.user,
        }).exec();

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
        user.save();

        await sendEmail(
            user.email,
            "Password Updated",
            { name: `${user.first_name} ${user.last_name}` },
            "./template/passwordUpdated.handlebars"
        );

        res.status(201).json("Updated password!");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const confirmPassword = async (req, res) => {
    try {
        const { password } = req.body;
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const user = await User.findOne({
            _id: req.params.user,
        }).exec();

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Wrong password!" });

        res.status(201).json({ passConfirmed: "Password changed!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getRecievingUser = async (req, res) => {
    try {
        req.params.eventType = mongoose.Types.ObjectId(req.params.eventType);
        const eventType = await EventType.findOne({
            _id: req.params.eventType,
        }).exec();
        if (!eventType) return res.status(500).json("Event type not found!");
        const user = await User.findOne({
            _id: eventType.owner_id,
        }).exec();
        if (!user) return res.status(500).json("User not found!");

        let secureUser = user._doc;
        delete secureUser.googleTokens;
        delete secureUser.password;
        delete secureUser.loginToken;
        delete secureUser._id;
        delete secureUser.createdAt;
        delete secureUser.updatedAt;
        delete secureUser.__v;

        res.status(201).json(secureUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getFirstFourUsers = async (req, res) => {
    try {
        const users = req.params.filter
            ? await User.find({
                  email: { $regex: "^" + req.params.filter, $options: "i" },
              })
                  .limit(4)
                  .exec()
            : [];

        let secureUsers = users.map((user) => {
            let secureUser = user._doc;
            delete secureUser.googleTokens;
            delete secureUser.password;
            delete secureUser.loginToken;
            delete secureUser._id;
            delete secureUser.createdAt;
            delete secureUser.updatedAt;
            delete secureUser.__v;
            return secureUser;
        });

        res.status(201).json(secureUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getAttendeesInfo = async (req, res) => {
    try {
        req.params.event = mongoose.Types.ObjectId(req.params.event);
        const users = await User.find({
            "events.event_id": req.params.event,
        }).exec();

        let secureUsers = users.map((user) => {
            let secureUser = user._doc;
            delete secureUser.googleTokens;
            delete secureUser.password;
            delete secureUser.loginToken;
            delete secureUser._id;
            delete secureUser.createdAt;
            delete secureUser.updatedAt;
            delete secureUser.__v;
            return secureUser;
        });

        res.status(201).json(secureUsers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VIEWS
export const createView = async (req, res) => {
    try {
        const { view_name, view_desc = "", view_color } = req.body;

        // Find user
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // New View Instance
        const newView = new View({
            owner_id: req.params.user,
            view_name,
            view_desc,
            view_color,
            view_schedule: {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            },
            view_selected: true,
            event_types: [],
        });

        // Unselect old view
        if (user.views.length > 0) {
            const oldView = await View.findOne({
                owner_id: req.params.user,
                view_selected: true,
            }).exec();
            oldView.view_selected = false;
            user.views.forEach((view) => {
                view.view_selected = false;
            });
            await oldView.save();
        }

        // Save view and user
        user.views = [...user.views, newView];
        const savedNewView = await newView.save();
        await user.save();

        res.status(201).json(savedNewView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getView = async (req, res) => {
    try {
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        const view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        res.status(201).json(view);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateView = async (req, res) => {
    try {
        const {
            view_name,
            view_desc,
            view_color,
            view_schedule,
            view_selected,
        } = req.body;

        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Update view
        view.view_name = view_name;
        view.view_desc = view_desc;
        view.view_color = view_color;
        view.view_schedule = view_schedule;
        view.view_selected = view_selected;
        // Update view in user
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });

        // Save view
        const savedView = await view.save();
        await user.save();

        res.status(201).json(savedView);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteView = async (req, res) => {
    try {
        // Find view
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Delete view
        await View.deleteOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        user.views.forEach((v, idx) => {
            if (v._id.toString() === req.params.view.toString()) {
                user.views.splice(idx, 1);
            }
        });

        if (user.views.length > 0) {
            let selectedView = await View.findOne({
                _id: user.views[0]._id,
            }).exec();
            selectedView.view_selected = true;
            user.views[0].view_selected = true;
            await selectedView.save();
        }

        // Save user
        await user.save();

        res.status(201).json("View deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// EVENT TYPES
export const createEventType = async (req, res) => {
    try {
        const { event_type_name, event_type_duration, event_type_location } =
            req.body;

        // Find user & view
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        let user = await User.findOne({ _id: req.params.user }).exec();
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();

        // New Event type Instance
        const newEventType = new EventType({
            owner_id: req.params.user,
            view_id: req.params.view,
            event_type_name,
            event_type_duration,
            event_type_location,
            events: [],
        });

        // Save view, user, & eventType
        view.event_types = [...view.event_types, newEventType];
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });
        const savedNewEventType = await newEventType.save();
        await view.save();
        await user.save();

        res.status(201).json(savedNewEventType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getEventType = async (req, res) => {
    try {
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.eventType = mongoose.Types.ObjectId(req.params.eventType);
        const eventType = await EventType.findOne({
            _id: req.params.eventType,
            owner_id: req.params.user,
            view_id: req.params.view,
        }).exec();
        res.status(201).json(eventType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const updateEventType = async (req, res) => {
    try {
        const { event_type_name, event_type_duration, event_type_location } =
            req.body;

        // Find eventType
        req.params.eventType = mongoose.Types.ObjectId(req.params.eventType);
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let eventType = await EventType.findOne({
            _id: req.params.eventType,
            owner_id: req.params.user,
            view_id: req.params.view,
        }).exec();
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Update event-type
        eventType.event_type_name = event_type_name;
        eventType.event_type_duration = event_type_duration;
        eventType.event_type_location = event_type_location;
        // Update eventType in view
        view.event_types.forEach((et, idx) => {
            if (et._id.toString() === eventType._id.toString()) {
                view.event_types[idx] = eventType;
            }
        });
        // Update view in user
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });

        // Save view & user
        const savedEventType = await eventType.save();
        await view.save();
        await user.save();

        res.status(201).json(savedEventType);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteEventType = async (req, res) => {
    try {
        // Find eventType
        req.params.eventType = mongoose.Types.ObjectId(req.params.eventType);
        req.params.view = mongoose.Types.ObjectId(req.params.view);
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        let view = await View.findOne({
            _id: req.params.view,
            owner_id: req.params.user,
        }).exec();
        let user = await User.findOne({ _id: req.params.user }).exec();

        // Delete eventType
        await EventType.deleteOne({
            _id: req.params.eventType,
            owner_id: req.params.user,
            view_id: req.params.view,
        }).exec();
        view.event_types.forEach((et, idx) => {
            if (et._id.toString() === req.params.eventType.toString()) {
                view.event_types.splice(idx, 1);
            }
        });
        user.views.forEach((v, idx) => {
            if (v._id.toString() === view._id.toString()) {
                user.views[idx] = view;
            }
        });

        // Save user & view
        await view.save();
        await user.save();

        res.status(201).json("Event-type deleted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// EVENTS
export const createEvent = async (req, res) => {
    try {
        const { event_date, event_duration, event_notes, event_attendees } =
            req.body;
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.eventType = mongoose.Types.ObjectId(req.params.eventType);
        const eventType = await EventType.findOne({
            _id: req.params.eventType,
        });

        // Create & save base event for sender
        let newEvents = [
            new Event({
                owner_id: req.params.user,
                sender_id: req.params.user,
                event_type_id: eventType._id,
                event_name: eventType.event_type_name,
                event_location: eventType.event_type_location,
                event_id: undefined,
                event_date,
                event_duration,
                event_notes,
                event_attendees,
                event_status: "pending",
                event_attending: true,
            }),
        ];
        newEvents[0].event_id = newEvents[0]._id;
        let users = [await User.findOne({ _id: req.params.user }).exec()];
        let emails = [{ email: users[0].email, responseStatus: "accepted" }];
        users[0].events.push(newEvents[0]);
        await newEvents[0].save();
        await users[0].save();
        const date = new Date(event_date);

        await sendEmail(
            users[0].email,
            `${eventType.event_type_name} Has Been Booked!`,
            {
                name: `${users[0].first_name} ${users[0].last_name}`,
                event: eventType.event_type_name,
                location: eventType.event_type_location,
                date: `${date.toLocaleDateString("en-us", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })} ${date.toLocaleTimeString()}`,
                duration: event_duration,
                notes: event_notes,
                attendees: event_attendees,
            },
            "./template/newEvent.handlebars"
        );

        // Create & save event for receivers
        for (const [idx, attendee] of event_attendees.entries()) {
            if (attendee !== users[0].email) {
                let user = await User.findOne({ email: attendee }).exec();
                newEvents = [
                    ...newEvents,
                    new Event({
                        owner_id: user._id,
                        sender_id: req.params.user,
                        event_type_id: eventType._id,
                        event_name: eventType.event_type_name,
                        event_location: eventType.event_type_location,
                        event_id: newEvents[0]._id,
                        event_date,
                        event_duration,
                        event_notes,
                        event_attendees,
                        event_status: "pending",
                        event_attending: false,
                    }),
                ];
                const date = new Date(event_date);

                await sendEmail(
                    user.email,
                    `You've been invited to ${eventType.event_type_name}!`,
                    {
                        name: `${user.first_name} ${user.last_name}`,
                        event: eventType.event_type_name,
                        sender: `${users[0].first_name} ${users[0].last_name}`,
                        location: eventType.event_type_location,
                        date: `${date.toLocaleDateString("en-us", {
                            weekday: "long",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })} ${date.toLocaleTimeString()}`,
                        duration: event_duration,
                        notes: event_notes,
                        attendees: event_attendees,
                    },
                    "./template/invitation.handlebars"
                );
                emails = [...emails, { email: user.email }];
                users = [
                    ...users,
                    user, //CHECK
                ];
                users[idx].events.push(newEvents[idx]);
                await newEvents[idx].save();
                await users[idx].save();
            }
        }

        // If the user is connected to google, create a google event
        if (users[0].googleTokens) {
            const credentials = {
                type: "authorized_user",
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                refresh_token: users[0].googleTokens.refresh_token,
            };
            const client = google.auth.fromJSON(credentials);
            const calendar = google.calendar({ version: "v3", auth: client });
            const endDate = (date, mins) => {
                let d = new Date(date);
                d.setTime(d.getTime() + mins * 60000);
                return d;
            };

            await calendar.events.insert({
                calendarId: "primary",
                requestBody: {
                    id: newEvents[0].event_id,
                    summary: newEvents[0].event_name,
                    description: newEvents[0].event_notes,
                    location: newEvents[0].event_location,
                    attendees: emails,
                    status: "confirmed",
                    start: {
                        dateTime: newEvents[0].event_date.toISOString(),
                    },
                    end: {
                        dateTime: endDate(
                            newEvents[0].event_date.toISOString(),
                            newEvents[0].event_duration
                        ).toISOString(),
                    },
                    reminders: {
                        useDefault: true,
                    },
                },
            });
        }

        res.status(201).json(newEvents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const getEvent = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.event = mongoose.Types.ObjectId(req.params.event);
        const event = await Event.findOne({
            event_id: req.params.event,
            owner_id: req.params.user,
        }).exec();
        res.status(201).json(event);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const acceptEvent = async (req, res) => {
    try {
        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.event = mongoose.Types.ObjectId(req.params.event);
        let user = await User.findOne({ _id: req.params.user }).exec();
        let event = await Event.findOne({
            owner_id: req.params.user,
            event_id: req.params.event,
        }).exec();

        let eventIndex = user.events.findIndex(
            (e) => e.event_id.toString() === event.event_id.toString()
        );
        user.events[eventIndex].event_attending = true;
        user.events[eventIndex].event_status = "confirmed";
        event.event_attending = true;
        event.event_status = "confirmed";

        // If the user is connected to google, accept the google event if it's there
        if (user.googleTokens) {
            try {
                const credentials = {
                    type: "authorized_user",
                    client_id: process.env.GOOGLE_CLIENT_ID,
                    client_secret: process.env.GOOGLE_CLIENT_SECRET,
                    refresh_token: user.googleTokens.refresh_token,
                };
                const client = google.auth.fromJSON(credentials);
                const calendar = google.calendar({
                    version: "v3",
                    auth: client,
                });
                const googleEvent = await calendar.events.get({
                    calendarId: "primary",
                    eventId: event.event_id.toString(),
                });

                if (googleEvent) {
                    await calendar.events.update({
                        calendarId: "primary",
                        eventId: event.event_id.toString(),
                        requestBody: {
                            ...googleEvent.data,
                            attendees: [
                                ...googleEvent.data.attendees,
                                {
                                    email: user.email,
                                    responseStatus: "accepted",
                                },
                            ],
                        },
                    });
                }
            } catch (err) {}
        }

        await user.save();
        await event.save();

        // Check if all users have accepted their events
        let allHaveAccepted = true;
        for (const attendee of event.event_attendees) {
            // Skip if the attendee id is the sender id
            let u = await User.findOne({
                email: attendee,
            });
            let e = await Event.findOne({
                owner_id: u._id,
                event_id: event.event_id,
            }).exec();

            if (e.event_attending === false) {
                allHaveAccepted = false;
            }
        }

        if (allHaveAccepted) {
            let s = await User.findOne({ _id: event.sender_id }).exec();
            let e = await Event.findOne({
                owner_id: s._id,
                event_id: event.event_id,
            }).exec();

            let senderEventIndex = s.events.findIndex(
                (ev) => ev.event_id.toString() === e.event_id.toString()
            );
            s.events[senderEventIndex].event_attending = true;
            s.events[senderEventIndex].event_status = "confirmed";
            e.event_attending = true;
            e.event_status = "confirmed";
            await s.save();
            await e.save();
        }

        res.status(201).json("Event accepted");
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
export const deleteEvent = async (req, res) => {
    try {
        // SCENARIOS:
        // 1. sender cancels -> set status of attending receivers to canceled, remove it for non-attending receivers
        // 2. receiver denies OR cancels -> remove it for receiver
        // 3. all receivers have denied -> set status to denied
        // 3. all attendees have canceled -> set status to canceled

        req.params.user = mongoose.Types.ObjectId(req.params.user);
        req.params.event = mongoose.Types.ObjectId(req.params.event);
        let user = await User.findOne({ _id: req.params.user }).exec();
        let event = await Event.findOne({
            owner_id: req.params.user,
            event_id: req.params.event,
        }).exec();
        const senderCanceled =
            user._id.toString() === event.sender_id.toString();

        // 1
        if (senderCanceled) {
            for (const attendee of event.event_attendees) {
                // Skip if the attendee email is the sender email
                if (attendee === user.email) {
                    continue;
                }

                let u = await User.findOne({ email: attendee }).exec();
                let e = await Event.findOne({
                    owner_id: u._id,
                    event_id: event.event_id,
                }).exec();

                // If user is not attending, remove the event
                let eventIndex = u.events.findIndex(
                    (e) => e.event_id.toString() === event.event_id.toString()
                );
                if (!u.events[eventIndex].event_attending) {
                    u.events.splice(eventIndex, 1);
                    await Event.deleteOne({
                        owner_id: u._id,
                        event_id: event.event_id,
                    });
                    await u.save();
                    continue;
                }

                // If user is attending, then remove attendees, set their event_attending to false, and set their event_status to canceled
                if (u.events[eventIndex].event_attending) {
                    u.events[eventIndex].event_attendees = [];
                    u.events[eventIndex].event_status = "canceled";
                    u.events[eventIndex].event_attending = false;
                    e.event_attendees = [];
                    e.event_status = "canceled";
                    e.event_attending = false;
                    await u.save();
                    await e.save();
                    let sender = await User.findOne({
                        _id: event.sender_id,
                    }).exec();

                    const date = new Date(event.event_date);

                    await sendEmail(
                        u.email,
                        `Event Canceled: ${event.event_name}!`,
                        {
                            name: `${u.first_name} ${u.last_name}`,
                            event: event.event_name,
                            sender: `${sender.first_name} ${sender.last_name}`,
                            location: event.event_location,
                            date: `${date.toLocaleDateString("en-us", {
                                weekday: "long",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })} ${date.toLocaleTimeString()}`,
                            duration: event.event_duration,
                            notes: event.event_notes,
                            attendees: event.event_attendees,
                        },
                        "./template/eventCanceled.handlebars"
                    );
                    continue;
                }
            }

            if (user.googleTokens) {
                try {
                    const credentials = {
                        type: "authorized_user",
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: user.googleTokens.refresh_token,
                    };
                    const client = google.auth.fromJSON(credentials);
                    const calendar = google.calendar({
                        version: "v3",
                        auth: client,
                    });
                    const googleEvent = await calendar.events.get({
                        calendarId: "primary",
                        eventId: event.event_id.toString(),
                    });
                    if (googleEvent) {
                        await calendar.events.delete({
                            calendarId: "primary",
                            eventId: event.event_id.toString(),
                            sendUpdates: "all",
                        });
                    }
                } catch (err) {}
            }

            let senderEventIndex = user.events.findIndex(
                (e) => e.event_id.toString() === event.event_id.toString()
            );
            user.events.splice(senderEventIndex, 1);
            await Event.deleteOne({
                owner_id: user._id,
                event_id: event.event_id,
            }).exec();
            await user.save();
        }

        // 2, 3, 4
        if (!senderCanceled) {
            // Remove user from other peoples attendees list
            for (const attendee of event.event_attendees) {
                if (attendee !== user.email) {
                    let u = await User.findOne({ email: attendee }).exec();
                    let e = await Event.findOne({
                        owner_id: u._id,
                        event_id: event.event_id,
                    }).exec();
                    let eventIndex = u.events.findIndex(
                        (e) =>
                            e.event_id.toString() === event.event_id.toString()
                    );
                    let cancelersIndex = u.events[
                        eventIndex
                    ].event_attendees.findIndex(
                        (attendee) => attendee === user.email
                    );
                    u.events[eventIndex].event_attendees.splice(
                        cancelersIndex,
                        1
                    );
                    e.event_attendees.splice(cancelersIndex, 1);
                    await u.save();
                    await e.save();
                }
            }

            // Check if sender has been completely canceled on or denied by every receiver before deleting this last receivers event
            if (event.event_attendees.length === 2) {
                let s = await User.findOne({
                    _id: event.sender_id,
                }).exec();
                let e = await Event.findOne({
                    owner_id: event.sender_id,
                    event_id: event.event_id,
                }).exec();
                let eventIndex = s.events.findIndex(
                    (e) => e.event_id.toString() === event.event_id.toString()
                );
                if (s.events[eventIndex].event_status === "confirmed") {
                    s.events[eventIndex].event_status = "canceled";
                    e.event_status = "canceled";
                } else if (s.events[eventIndex].event_status === "pending") {
                    s.events[eventIndex].event_status = "denied";
                    e.event_status = "denied";
                }
                await s.save();
                await e.save();
            }

            if (user.googleTokens) {
                try {
                    const credentials = {
                        type: "authorized_user",
                        client_id: process.env.GOOGLE_CLIENT_ID,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET,
                        refresh_token: user.googleTokens.refresh_token,
                    };
                    const client = google.auth.fromJSON(credentials);
                    const calendar = google.calendar({
                        version: "v3",
                        auth: client,
                    });
                    const googleEvent = await calendar.events.get({
                        calendarId: "primary",
                        eventId: event.event_id.toString(),
                    });

                    if (googleEvent) {
                        await calendar.events.delete({
                            calendarId: "primary",
                            eventId: event.event_id.toString(),
                        });
                    }
                } catch (err) {}
            }

            // Delete user event
            let receiverEventIndex = user.events.findIndex(
                (e) => e.event_id.toString() === event.event_id.toString()
            );
            user.events.splice(receiverEventIndex, 1);
            await Event.deleteOne({
                owner_id: user._id,
                event_id: event.event_id,
            }).exec();
            await user.save();
        }

        res.status(201).json(
            `${
                senderCanceled
                    ? "Sender canceled"
                    : "Receiver canceled or denied"
            }, event deleted`
        );
    } catch (err) {
        res.status(500).json({ error: err });
    }
};
