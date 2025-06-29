// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIPromise } from "../../core/api-promise";
import { APIResource } from "../../core/resource";
import { buildHeaders } from "../../internal/headers";
import { RequestOptions } from "../../internal/request-options";
import { path } from "../../internal/utils/path";
import * as Shared from "../shared";

export class Events extends APIResource {
  /**
   * Creates an event.
   */
  create(
    calendarID: string,
    params: EventCreateParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Event> {
    const {
      alt,
      conferenceDataVersion,
      fields,
      key,
      maxAttendees,
      oauth_token,
      prettyPrint,
      quotaUser,
      sendNotifications,
      sendUpdates,
      supportsAttachments,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post(path`/calendars/${calendarID}/events`, {
      query: {
        alt,
        conferenceDataVersion,
        fields,
        key,
        maxAttendees,
        oauth_token,
        prettyPrint,
        quotaUser,
        sendNotifications,
        sendUpdates,
        supportsAttachments,
        userIp,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns an event based on its Google Calendar ID. To retrieve an event using its
   * iCalendar ID, call the events.list method using the iCalUID parameter.
   */
  retrieve(
    eventID: string,
    params: EventRetrieveParams,
    options?: RequestOptions,
  ): APIPromise<Event> {
    const { calendarId, ...query } = params;
    return this._client.get(path`/calendars/${calendarId}/events/${eventID}`, {
      query,
      ...options,
    });
  }

  /**
   * Updates an event.
   */
  update(
    eventID: string,
    params: EventUpdateParams,
    options?: RequestOptions,
  ): APIPromise<Event> {
    const {
      calendarId,
      alt,
      alwaysIncludeEmail,
      conferenceDataVersion,
      fields,
      key,
      maxAttendees,
      oauth_token,
      prettyPrint,
      quotaUser,
      sendNotifications,
      sendUpdates,
      supportsAttachments,
      userIp,
      ...body
    } = params;
    return this._client.put(path`/calendars/${calendarId}/events/${eventID}`, {
      query: {
        alt,
        alwaysIncludeEmail,
        conferenceDataVersion,
        fields,
        key,
        maxAttendees,
        oauth_token,
        prettyPrint,
        quotaUser,
        sendNotifications,
        sendUpdates,
        supportsAttachments,
        userIp,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns events on the specified calendar.
   */
  list(
    calendarID: string,
    query: EventListParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Events> {
    return this._client.get(path`/calendars/${calendarID}/events`, {
      query,
      ...options,
    });
  }

  /**
   * Deletes an event.
   */
  delete(
    eventID: string,
    params: EventDeleteParams,
    options?: RequestOptions,
  ): APIPromise<void> {
    const {
      calendarId,
      alt,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      sendNotifications,
      sendUpdates,
      userIp,
    } = params;
    return this._client.delete(
      path`/calendars/${calendarId}/events/${eventID}`,
      {
        query: {
          alt,
          fields,
          key,
          oauth_token,
          prettyPrint,
          quotaUser,
          sendNotifications,
          sendUpdates,
          userIp,
        },
        ...options,
        headers: buildHeaders([{ Accept: "*/*" }, options?.headers]),
      },
    );
  }

  /**
   * Imports an event. This operation is used to add a private copy of an existing
   * event to a calendar.
   */
  import(
    calendarID: string,
    params: EventImportParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Event> {
    const {
      alt,
      conferenceDataVersion,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      supportsAttachments,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post(path`/calendars/${calendarID}/events/import`, {
      query: {
        alt,
        conferenceDataVersion,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        supportsAttachments,
        userIp,
      },
      body,
      ...options,
    });
  }

  /**
   * Returns instances of the specified recurring event.
   */
  instances(
    eventID: string,
    params: EventInstancesParams,
    options?: RequestOptions,
  ): APIPromise<Events> {
    const { calendarId, ...query } = params;
    return this._client.get(
      path`/calendars/${calendarId}/events/${eventID}/instances`,
      {
        query,
        ...options,
      },
    );
  }

  /**
   * Moves an event to another calendar, i.e. changes an event's organizer. Note that
   * only default events can be moved; outOfOffice, focusTime and workingLocation
   * events cannot be moved.
   */
  move(
    eventID: string,
    params: EventMoveParams,
    options?: RequestOptions,
  ): APIPromise<Event> {
    const {
      calendarId,
      destination,
      alt,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      sendNotifications,
      sendUpdates,
      userIp,
    } = params;
    return this._client.post(
      path`/calendars/${calendarId}/events/${eventID}/move`,
      {
        query: {
          destination,
          alt,
          fields,
          key,
          oauth_token,
          prettyPrint,
          quotaUser,
          sendNotifications,
          sendUpdates,
          userIp,
        },
        ...options,
      },
    );
  }

  /**
   * Creates an event based on a simple text string.
   */
  quickAdd(
    calendarID: string,
    params: EventQuickAddParams,
    options?: RequestOptions,
  ): APIPromise<Event> {
    const {
      text,
      alt,
      fields,
      key,
      oauth_token,
      prettyPrint,
      quotaUser,
      sendNotifications,
      sendUpdates,
      userIp,
    } = params;
    return this._client.post(path`/calendars/${calendarID}/events/quickAdd`, {
      query: {
        text,
        alt,
        fields,
        key,
        oauth_token,
        prettyPrint,
        quotaUser,
        sendNotifications,
        sendUpdates,
        userIp,
      },
      ...options,
    });
  }

  /**
   * Watch for changes to Events resources.
   */
  watch(
    calendarID: string,
    params: EventWatchParams | null | undefined = {},
    options?: RequestOptions,
  ): APIPromise<Shared.Channel> {
    const {
      alt,
      alwaysIncludeEmail,
      eventTypes,
      fields,
      iCalUID,
      key,
      maxAttendees,
      maxResults,
      oauth_token,
      orderBy,
      pageToken,
      prettyPrint,
      privateExtendedProperty,
      q,
      quotaUser,
      sharedExtendedProperty,
      showDeleted,
      showHiddenInvitations,
      singleEvents,
      syncToken,
      timeMax,
      timeMin,
      timeZone,
      updatedMin,
      userIp,
      ...body
    } = params ?? {};
    return this._client.post(path`/calendars/${calendarID}/events/watch`, {
      query: {
        alt,
        alwaysIncludeEmail,
        eventTypes,
        fields,
        iCalUID,
        key,
        maxAttendees,
        maxResults,
        oauth_token,
        orderBy,
        pageToken,
        prettyPrint,
        privateExtendedProperty,
        q,
        quotaUser,
        sharedExtendedProperty,
        showDeleted,
        showHiddenInvitations,
        singleEvents,
        syncToken,
        timeMax,
        timeMin,
        timeZone,
        updatedMin,
        userIp,
      },
      body,
      ...options,
    });
  }
}

export interface Event {
  /**
   * Opaque identifier of the event. When creating new single or recurring events,
   * you can specify their IDs. Provided IDs must follow these rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Whether anyone can invite themselves to the event (deprecated). Optional. The
   * default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<Event.Attachment>;

  /**
   * The attendees of the event. See the Events with attendees guide for more
   * information on scheduling events with other calendar users. Service accounts
   * need to use domain-wide delegation of authority to populate the attendee list.
   */
  attendees?: Array<Event.Attendee>;

  /**
   * Whether attendees may have been omitted from the event's representation. When
   * retrieving an event, this may be due to a restriction specified by the
   * maxAttendee query parameter. When updating an event, this can be used to only
   * update the participant's response. Optional. The default is False.
   */
  attendeesOmitted?: boolean;

  /**
   * The color of the event. This is an ID referring to an entry in the event section
   * of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  conferenceData?: Event.ConferenceData;

  /**
   * Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * The creator of the event. Read-only.
   */
  creator?: Event.Creator;

  /**
   * Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  end?: Event.End;

  /**
   * Whether the end time is actually unspecified. An end time is still provided for
   * compatibility reasons, even if this attribute is set to True. The default is
   * False.
   */
  endTimeUnspecified?: boolean;

  /**
   * ETag of the resource.
   */
  etag?: string;

  /**
   * Specific type of the event. This cannot be modified after the event is created.
   * Possible values are:
   *
   * - "default" - A regular event or not further specified.
   * - "outOfOffice" - An out-of-office event.
   * - "focusTime" - A focus-time event.
   * - "workingLocation" - A working location event. Currently, only "default " and
   *   "workingLocation" events can be created using the API. Extended support for
   *   other event types will be made available in later releases.
   */
  eventType?: string;

  /**
   * Extended properties of the event.
   */
  extendedProperties?: Event.ExtendedProperties;

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: Event.FocusTimeProperties;

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  gadget?: Event.Gadget;

  /**
   * Whether attendees other than the organizer can invite others to the event.
   * Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Whether attendees other than the organizer can modify the event. Optional. The
   * default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Whether attendees other than the organizer can see who the event's attendees
   * are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * An absolute link to the Google Hangout associated with this event. Read-only.
   */
  hangoutLink?: string;

  /**
   * An absolute link to this event in the Google Calendar Web UI. Read-only.
   */
  htmlLink?: string;

  /**
   * Event unique identifier as defined in RFC5545. It is used to uniquely identify
   * events accross calendaring systems and must be supplied when importing events
   * via the import method. Note that the iCalUID and the id are not identical and
   * only one of them should be supplied at event creation time. One difference in
   * their semantics is that in recurring events, all occurrences of one event have
   * different ids while they all share the same iCalUIDs. To retrieve an event using
   * its iCalUID, call the events.list method using the iCalUID parameter. To
   * retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Whether this is a locked event copy where no changes can be made to the main
   * event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  organizer?: Event.Organizer;

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  originalStartTime?: Event.OriginalStartTime;

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: Event.OutOfOfficeProperties;

  /**
   * If set to True, Event propagation is disabled. Note that it is not the same
   * thing as Private event properties. Optional. Immutable. The default is False.
   */
  privateCopy?: boolean;

  /**
   * List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event, as
   * specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in this
   * field; event start and end times are specified in the start and end fields. This
   * field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * For an instance of a recurring event, this is the id of the recurring event to
   * which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Information about the event's reminders for the authenticated user.
   */
  reminders?: Event.Reminders;

  /**
   * Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  source?: Event.Source;

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  start?: Event.Start;

  /**
   * Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Title of the event.
   */
  summary?: string;

  /**
   * Whether the event blocks time on the calendar. Optional. Possible values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Last modification time of the event (as a RFC3339 timestamp). Read-only.
   */
  updated?: string;

  /**
   * Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Working location event data.
   */
  workingLocationProperties?: Event.WorkingLocationProperties;
}

export namespace Event {
  export interface Attachment {
    /**
     * ID of the attached file. Read-only. For Google Drive files, this is the ID of
     * the corresponding Files resource entry in the Drive API.
     */
    fileId?: string;

    /**
     * URL link to the attachment. For adding Google Drive file attachments use the
     * same format as in alternateLink property of the Files resource in the Drive API.
     * Required when adding an attachment.
     */
    fileUrl?: string;

    /**
     * URL link to the attachment's icon. This field can only be modified for custom
     * third-party attachments.
     */
    iconLink?: string;

    /**
     * Internet media type (MIME type) of the attachment.
     */
    mimeType?: string;

    /**
     * Attachment title.
     */
    title?: string;
  }

  export interface Attendee {
    /**
     * The attendee's Profile ID, if available.
     */
    id?: string;

    /**
     * Number of additional guests. Optional. The default is 0.
     */
    additionalGuests?: number;

    /**
     * The attendee's response comment. Optional.
     */
    comment?: string;

    /**
     * The attendee's name, if available. Optional.
     */
    displayName?: string;

    /**
     * The attendee's email address, if available. This field must be present when
     * adding an attendee. It must be a valid email address as per RFC5322. Required
     * when adding an attendee.
     */
    email?: string;

    /**
     * Whether this is an optional attendee. Optional. The default is False.
     */
    optional?: boolean;

    /**
     * Whether the attendee is the organizer of the event. Read-only. The default is
     * False.
     */
    organizer?: boolean;

    /**
     * Whether the attendee is a resource. Can only be set when the attendee is added
     * to the event for the first time. Subsequent modifications are ignored. Optional.
     * The default is False.
     */
    resource?: boolean;

    /**
     * The attendee's response status. Possible values are:
     *
     * - "needsAction" - The attendee has not responded to the invitation (recommended
     *   for new events).
     * - "declined" - The attendee has declined the invitation.
     * - "tentative" - The attendee has tentatively accepted the invitation.
     * - "accepted" - The attendee has accepted the invitation. Warning: If you add an
     *   event using the values declined, tentative, or accepted, attendees with the
     *   "Add invitations to my calendar" setting set to "When I respond to invitation
     *   in email" won't see an event on their calendar unless they choose to change
     *   their invitation response in the event invitation email.
     */
    responseStatus?: string;

    /**
     * Whether this entry represents the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  export interface ConferenceData {
    /**
     * The ID of the conference. Can be used by developers to keep track of
     * conferences, should not be displayed to users. The ID value is formed
     * differently for each conference solution type:
     *
     * - eventHangout: ID is not set. (This conference type is deprecated.)
     * - eventNamedHangout: ID is the name of the Hangout. (This conference type is
     *   deprecated.)
     * - hangoutsMeet: ID is the 10-letter meeting code, for example aaa-bbbb-ccc.
     * - addOn: ID is defined by the third-party provider. Optional.
     */
    conferenceId?: string;

    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    conferenceSolution?: ConferenceData.ConferenceSolution;

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    createRequest?: ConferenceData.CreateRequest;

    /**
     * Information about individual conference entry points, such as URLs or phone
     * numbers. All of them must belong to the same conference. Either
     * conferenceSolution and at least one entryPoint, or createRequest is required.
     */
    entryPoints?: Array<ConferenceData.EntryPoint>;

    /**
     * Additional notes (such as instructions from the domain administrator, legal
     * notices) to display to the user. Can contain HTML. The maximum length is 2048
     * characters. Optional.
     */
    notes?: string;

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    parameters?: ConferenceData.Parameters;

    /**
     * The signature of the conference data. Generated on server side. Unset for a
     * conference with a failed create request. Optional for a conference with a
     * pending create request.
     */
    signature?: string;
  }

  export namespace ConferenceData {
    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    export interface ConferenceSolution {
      /**
       * The user-visible icon for this solution.
       */
      iconUri?: string;

      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      key?: ConferenceSolution.Key;

      /**
       * The user-visible name of this solution. Not localized.
       */
      name?: string;
    }

    export namespace ConferenceSolution {
      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      export interface Key {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }
    }

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    export interface CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      conferenceSolutionKey?: CreateRequest.ConferenceSolutionKey;

      /**
       * The client-generated unique ID for this request. Clients should regenerate this
       * ID for every new request. If an ID provided is the same as for the previous
       * request, the request is ignored.
       */
      requestId?: string;

      /**
       * The status of the conference create request.
       */
      status?: CreateRequest.Status;
    }

    export namespace CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      export interface ConferenceSolutionKey {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }

      /**
       * The status of the conference create request.
       */
      export interface Status {
        /**
         * The current status of the conference create request. Read-only. The possible
         * values are:
         *
         * - "pending": the conference create request is still being processed.
         * - "success": the conference create request succeeded, the entry points are
         *   populated.
         * - "failure": the conference create request failed, there are no entry points.
         */
        statusCode?: string;
      }
    }

    export interface EntryPoint {
      /**
       * The access code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      accessCode?: string;

      /**
       * Features of the entry point, such as being toll or toll-free. One entry point
       * can have multiple features. However, toll and toll-free cannot be both set on
       * the same entry point.
       */
      entryPointFeatures?: Array<string>;

      /**
       * The type of the conference entry point. Possible values are:
       *
       * - "video" - joining a conference over HTTP. A conference can have zero or one
       *   video entry point.
       * - "phone" - joining a conference by dialing a phone number. A conference can
       *   have zero or more phone entry points.
       * - "sip" - joining a conference over SIP. A conference can have zero or one sip
       *   entry point.
       * - "more" - further conference joining instructions, for example additional phone
       *   numbers. A conference can have zero or one more entry point. A conference with
       *   only a more entry point is not a valid conference.
       */
      entryPointType?: string;

      /**
       * The label for the URI. Visible to end users. Not localized. The maximum length
       * is 512 characters. Examples:
       *
       * - for video: meet.google.com/aaa-bbbb-ccc
       * - for phone: +1 123 268 2601
       * - for sip: 12345678@altostrat.com
       * - for more: should not be filled
       *   Optional.
       */
      label?: string;

      /**
       * The meeting code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      meetingCode?: string;

      /**
       * The passcode to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       */
      passcode?: string;

      /**
       * The password to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      password?: string;

      /**
       * The PIN to access the conference. The maximum length is 128 characters. When
       * creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      pin?: string;

      /**
       * The CLDR/ISO 3166 region code for the country associated with this phone access.
       * Example: "SE" for Sweden. Calendar backend will populate this field only for
       * EntryPointType.PHONE.
       */
      regionCode?: string;

      /**
       * The URI of the entry point. The maximum length is 1300 characters. Format:
       *
       * - for video, http: or https: schema is required.
       * - for phone, tel: schema is required. The URI should include the entire dial
       *   sequence (e.g., tel:+12345678900,,,123456789;1234).
       * - for sip, sip: schema is required, e.g., sip:12345678@myprovider.com.
       * - for more, http: or https: schema is required.
       */
      uri?: string;
    }

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    export interface Parameters {
      /**
       * Additional add-on specific data.
       */
      addOnParameters?: Parameters.AddOnParameters;
    }

    export namespace Parameters {
      /**
       * Additional add-on specific data.
       */
      export interface AddOnParameters {
        parameters?: Record<string, string>;
      }
    }
  }

  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  export interface End {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: Record<string, string>;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: Record<string, string>;
  }

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  export interface FocusTimeProperties {
    /**
     * Whether to decline meeting invitations which overlap Focus Time events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Focus Time event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * The status to mark the user in Chat and related products. This can be available
     * or doNotDisturb.
     */
    chatStatus?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: Record<string, string>;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  export interface OriginalStartTime {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  export interface OutOfOfficeProperties {
    /**
     * Whether to decline meeting invitations which overlap Out of office events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Out of office event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * Information about the event's reminders for the authenticated user.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<Reminders.Override>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  export namespace Reminders {
    export interface Override {
      /**
       * The method used by this reminder. Possible values are:
       *
       * - "email" - Reminders are sent via email.
       * - "popup" - Reminders are sent via a UI popup.
       *   Required when adding a reminder.
       */
      method?: string;

      /**
       * Number of minutes before the start of the event when the reminder should
       * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
       * when adding a reminder.
       */
      minutes?: number;
    }
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  export interface Start {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Working location event data.
   */
  export interface WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    customLocation?: WorkingLocationProperties.CustomLocation;

    /**
     * If present, specifies that the user is working at home.
     */
    homeOffice?: unknown;

    /**
     * If present, specifies that the user is working from an office.
     */
    officeLocation?: WorkingLocationProperties.OfficeLocation;

    /**
     * Type of the working location. Possible values are:
     *
     * - "homeOffice" - The user is working at home.
     * - "officeLocation" - The user is working from an office.
     * - "customLocation" - The user is working from a custom location. Any details are
     *   specified in a sub-field of the specified name, but this field may be missing
     *   if empty. Any other fields are ignored. Required when adding working location
     *   properties.
     */
    type?: string;
  }

  export namespace WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    export interface CustomLocation {
      /**
       * An optional extra label for additional information.
       */
      label?: string;
    }

    /**
     * If present, specifies that the user is working from an office.
     */
    export interface OfficeLocation {
      /**
       * An optional building identifier. This should reference a building ID in the
       * organization's Resources database.
       */
      buildingId?: string;

      /**
       * An optional desk identifier.
       */
      deskId?: string;

      /**
       * An optional floor identifier.
       */
      floorId?: string;

      /**
       * An optional floor section identifier.
       */
      floorSectionId?: string;

      /**
       * The office name that's displayed in Calendar Web and Mobile clients. We
       * recommend you reference a building name in the organization's Resources
       * database.
       */
      label?: string;
    }
  }
}

export interface Events {
  /**
   * The user's access role for this calendar. Read-only. Possible values are:
   *
   * - "none" - The user has no access.
   * - "freeBusyReader" - The user has read access to free/busy information.
   * - "reader" - The user has read access to the calendar. Private events will
   *   appear to users with reader access, but event details will be hidden.
   * - "writer" - The user has read and write access to the calendar. Private events
   *   will appear to users with writer access, and event details will be visible.
   * - "owner" - The user has ownership of the calendar. This role has all of the
   *   permissions of the writer role with the additional ability to see and
   *   manipulate ACLs.
   */
  accessRole?: string;

  /**
   * The default reminders on the calendar for the authenticated user. These
   * reminders apply to all events on this calendar that do not explicitly override
   * them (i.e. do not have reminders.useDefault set to True).
   */
  defaultReminders?: Array<Events.DefaultReminder>;

  /**
   * Description of the calendar. Read-only.
   */
  description?: string;

  /**
   * ETag of the collection.
   */
  etag?: string;

  /**
   * List of events on the calendar.
   */
  items?: Array<Event>;

  /**
   * Type of the collection ("calendar#events").
   */
  kind?: string;

  /**
   * Token used to access the next page of this result. Omitted if no further results
   * are available, in which case nextSyncToken is provided.
   */
  nextPageToken?: string;

  /**
   * Token used at a later point in time to retrieve only the entries that have
   * changed since this result was returned. Omitted if further results are
   * available, in which case nextPageToken is provided.
   */
  nextSyncToken?: string;

  /**
   * Title of the calendar. Read-only.
   */
  summary?: string;

  /**
   * The time zone of the calendar. Read-only.
   */
  timeZone?: string;

  /**
   * Last modification time of the calendar (as a RFC3339 timestamp). Read-only.
   */
  updated?: string;
}

export namespace Events {
  export interface DefaultReminder {
    /**
     * The method used by this reminder. Possible values are:
     *
     * - "email" - Reminders are sent via email.
     * - "popup" - Reminders are sent via a UI popup.
     *   Required when adding a reminder.
     */
    method?: string;

    /**
     * Number of minutes before the start of the event when the reminder should
     * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
     * when adding a reminder.
     */
    minutes?: number;
  }
}

export interface EventCreateParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the creation of the new event. Note that
   * some emails might still be sent even if you set the value to false. The default
   * is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Whether to send notifications about the creation of the new event.
   * Note that some emails might still be sent. The default is false.
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<EventCreateParams.Attachment>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<EventCreateParams.Attendee>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: EventCreateParams.ConferenceData;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventCreateParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: EventCreateParams.End;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "default" - A regular event or not further specified.
   * - "outOfOffice" - An out-of-office event.
   * - "focusTime" - A focus-time event.
   * - "workingLocation" - A working location event. Currently, only "default " and
   *   "workingLocation" events can be created using the API. Extended support for
   *   other event types will be made available in later releases.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventCreateParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: EventCreateParams.FocusTimeProperties;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventCreateParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventCreateParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: EventCreateParams.OriginalStartTime;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: EventCreateParams.OutOfOfficeProperties;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   */
  reminders?: EventCreateParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventCreateParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: EventCreateParams.Start;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the event (as a RFC3339 timestamp).
   * Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: EventCreateParams.WorkingLocationProperties;
}

export namespace EventCreateParams {
  export interface Attachment {
    /**
     * ID of the attached file. Read-only. For Google Drive files, this is the ID of
     * the corresponding Files resource entry in the Drive API.
     */
    fileId?: string;

    /**
     * URL link to the attachment. For adding Google Drive file attachments use the
     * same format as in alternateLink property of the Files resource in the Drive API.
     * Required when adding an attachment.
     */
    fileUrl?: string;

    /**
     * URL link to the attachment's icon. This field can only be modified for custom
     * third-party attachments.
     */
    iconLink?: string;

    /**
     * Internet media type (MIME type) of the attachment.
     */
    mimeType?: string;

    /**
     * Attachment title.
     */
    title?: string;
  }

  export interface Attendee {
    /**
     * The attendee's Profile ID, if available.
     */
    id?: string;

    /**
     * Number of additional guests. Optional. The default is 0.
     */
    additionalGuests?: number;

    /**
     * The attendee's response comment. Optional.
     */
    comment?: string;

    /**
     * The attendee's name, if available. Optional.
     */
    displayName?: string;

    /**
     * The attendee's email address, if available. This field must be present when
     * adding an attendee. It must be a valid email address as per RFC5322. Required
     * when adding an attendee.
     */
    email?: string;

    /**
     * Whether this is an optional attendee. Optional. The default is False.
     */
    optional?: boolean;

    /**
     * Whether the attendee is the organizer of the event. Read-only. The default is
     * False.
     */
    organizer?: boolean;

    /**
     * Whether the attendee is a resource. Can only be set when the attendee is added
     * to the event for the first time. Subsequent modifications are ignored. Optional.
     * The default is False.
     */
    resource?: boolean;

    /**
     * The attendee's response status. Possible values are:
     *
     * - "needsAction" - The attendee has not responded to the invitation (recommended
     *   for new events).
     * - "declined" - The attendee has declined the invitation.
     * - "tentative" - The attendee has tentatively accepted the invitation.
     * - "accepted" - The attendee has accepted the invitation. Warning: If you add an
     *   event using the values declined, tentative, or accepted, attendees with the
     *   "Add invitations to my calendar" setting set to "When I respond to invitation
     *   in email" won't see an event on their calendar unless they choose to change
     *   their invitation response in the event invitation email.
     */
    responseStatus?: string;

    /**
     * Whether this entry represents the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  export interface ConferenceData {
    /**
     * The ID of the conference. Can be used by developers to keep track of
     * conferences, should not be displayed to users. The ID value is formed
     * differently for each conference solution type:
     *
     * - eventHangout: ID is not set. (This conference type is deprecated.)
     * - eventNamedHangout: ID is the name of the Hangout. (This conference type is
     *   deprecated.)
     * - hangoutsMeet: ID is the 10-letter meeting code, for example aaa-bbbb-ccc.
     * - addOn: ID is defined by the third-party provider. Optional.
     */
    conferenceId?: string;

    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    conferenceSolution?: ConferenceData.ConferenceSolution;

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    createRequest?: ConferenceData.CreateRequest;

    /**
     * Information about individual conference entry points, such as URLs or phone
     * numbers. All of them must belong to the same conference. Either
     * conferenceSolution and at least one entryPoint, or createRequest is required.
     */
    entryPoints?: Array<ConferenceData.EntryPoint>;

    /**
     * Additional notes (such as instructions from the domain administrator, legal
     * notices) to display to the user. Can contain HTML. The maximum length is 2048
     * characters. Optional.
     */
    notes?: string;

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    parameters?: ConferenceData.Parameters;

    /**
     * The signature of the conference data. Generated on server side. Unset for a
     * conference with a failed create request. Optional for a conference with a
     * pending create request.
     */
    signature?: string;
  }

  export namespace ConferenceData {
    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    export interface ConferenceSolution {
      /**
       * The user-visible icon for this solution.
       */
      iconUri?: string;

      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      key?: ConferenceSolution.Key;

      /**
       * The user-visible name of this solution. Not localized.
       */
      name?: string;
    }

    export namespace ConferenceSolution {
      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      export interface Key {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }
    }

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    export interface CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      conferenceSolutionKey?: CreateRequest.ConferenceSolutionKey;

      /**
       * The client-generated unique ID for this request. Clients should regenerate this
       * ID for every new request. If an ID provided is the same as for the previous
       * request, the request is ignored.
       */
      requestId?: string;

      /**
       * The status of the conference create request.
       */
      status?: CreateRequest.Status;
    }

    export namespace CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      export interface ConferenceSolutionKey {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }

      /**
       * The status of the conference create request.
       */
      export interface Status {
        /**
         * The current status of the conference create request. Read-only. The possible
         * values are:
         *
         * - "pending": the conference create request is still being processed.
         * - "success": the conference create request succeeded, the entry points are
         *   populated.
         * - "failure": the conference create request failed, there are no entry points.
         */
        statusCode?: string;
      }
    }

    export interface EntryPoint {
      /**
       * The access code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      accessCode?: string;

      /**
       * Features of the entry point, such as being toll or toll-free. One entry point
       * can have multiple features. However, toll and toll-free cannot be both set on
       * the same entry point.
       */
      entryPointFeatures?: Array<string>;

      /**
       * The type of the conference entry point. Possible values are:
       *
       * - "video" - joining a conference over HTTP. A conference can have zero or one
       *   video entry point.
       * - "phone" - joining a conference by dialing a phone number. A conference can
       *   have zero or more phone entry points.
       * - "sip" - joining a conference over SIP. A conference can have zero or one sip
       *   entry point.
       * - "more" - further conference joining instructions, for example additional phone
       *   numbers. A conference can have zero or one more entry point. A conference with
       *   only a more entry point is not a valid conference.
       */
      entryPointType?: string;

      /**
       * The label for the URI. Visible to end users. Not localized. The maximum length
       * is 512 characters. Examples:
       *
       * - for video: meet.google.com/aaa-bbbb-ccc
       * - for phone: +1 123 268 2601
       * - for sip: 12345678@altostrat.com
       * - for more: should not be filled
       *   Optional.
       */
      label?: string;

      /**
       * The meeting code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      meetingCode?: string;

      /**
       * The passcode to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       */
      passcode?: string;

      /**
       * The password to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      password?: string;

      /**
       * The PIN to access the conference. The maximum length is 128 characters. When
       * creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      pin?: string;

      /**
       * The CLDR/ISO 3166 region code for the country associated with this phone access.
       * Example: "SE" for Sweden. Calendar backend will populate this field only for
       * EntryPointType.PHONE.
       */
      regionCode?: string;

      /**
       * The URI of the entry point. The maximum length is 1300 characters. Format:
       *
       * - for video, http: or https: schema is required.
       * - for phone, tel: schema is required. The URI should include the entire dial
       *   sequence (e.g., tel:+12345678900,,,123456789;1234).
       * - for sip, sip: schema is required, e.g., sip:12345678@myprovider.com.
       * - for more, http: or https: schema is required.
       */
      uri?: string;
    }

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    export interface Parameters {
      /**
       * Additional add-on specific data.
       */
      addOnParameters?: Parameters.AddOnParameters;
    }

    export namespace Parameters {
      /**
       * Additional add-on specific data.
       */
      export interface AddOnParameters {
        parameters?: Record<string, string>;
      }
    }
  }

  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  export interface End {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: Record<string, string>;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: Record<string, string>;
  }

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  export interface FocusTimeProperties {
    /**
     * Whether to decline meeting invitations which overlap Focus Time events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Focus Time event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * The status to mark the user in Chat and related products. This can be available
     * or doNotDisturb.
     */
    chatStatus?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: Record<string, string>;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  export interface OriginalStartTime {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  export interface OutOfOfficeProperties {
    /**
     * Whether to decline meeting invitations which overlap Out of office events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Out of office event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * Information about the event's reminders for the authenticated user.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<Reminders.Override>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  export namespace Reminders {
    export interface Override {
      /**
       * The method used by this reminder. Possible values are:
       *
       * - "email" - Reminders are sent via email.
       * - "popup" - Reminders are sent via a UI popup.
       *   Required when adding a reminder.
       */
      method?: string;

      /**
       * Number of minutes before the start of the event when the reminder should
       * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
       * when adding a reminder.
       */
      minutes?: number;
    }
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  export interface Start {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Working location event data.
   */
  export interface WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    customLocation?: WorkingLocationProperties.CustomLocation;

    /**
     * If present, specifies that the user is working at home.
     */
    homeOffice?: unknown;

    /**
     * If present, specifies that the user is working from an office.
     */
    officeLocation?: WorkingLocationProperties.OfficeLocation;

    /**
     * Type of the working location. Possible values are:
     *
     * - "homeOffice" - The user is working at home.
     * - "officeLocation" - The user is working from an office.
     * - "customLocation" - The user is working from a custom location. Any details are
     *   specified in a sub-field of the specified name, but this field may be missing
     *   if empty. Any other fields are ignored. Required when adding working location
     *   properties.
     */
    type?: string;
  }

  export namespace WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    export interface CustomLocation {
      /**
       * An optional extra label for additional information.
       */
      label?: string;
    }

    /**
     * If present, specifies that the user is working from an office.
     */
    export interface OfficeLocation {
      /**
       * An optional building identifier. This should reference a building ID in the
       * organization's Resources database.
       */
      buildingId?: string;

      /**
       * An optional desk identifier.
       */
      deskId?: string;

      /**
       * An optional floor identifier.
       */
      floorId?: string;

      /**
       * An optional floor section identifier.
       */
      floorSectionId?: string;

      /**
       * The office name that's displayed in Calendar Web and Mobile clients. We
       * recommend you reference a building name in the organization's Resources
       * database.
       */
      label?: string;
    }
  }
}

export interface EventRetrieveParams {
  /**
   * Path param: Calendar identifier. To retrieve calendar IDs call the
   * calendarList.list method. If you want to access the primary calendar of the
   * currently logged in user, use the "primary" keyword.
   */
  calendarId: string;

  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventUpdateParams {
  /**
   * Path param: Calendar identifier. To retrieve calendar IDs call the
   * calendarList.list method. If you want to access the primary calendar of the
   * currently logged in user, use the "primary" keyword.
   */
  calendarId: string;

  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the event update (for example, description
   * changes, etc.). Note that some emails might still be sent even if you set the
   * value to false. The default is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the event update (for
   * example, title changes, etc.).
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<EventUpdateParams.Attachment>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<EventUpdateParams.Attendee>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: EventUpdateParams.ConferenceData;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventUpdateParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: EventUpdateParams.End;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "default" - A regular event or not further specified.
   * - "outOfOffice" - An out-of-office event.
   * - "focusTime" - A focus-time event.
   * - "workingLocation" - A working location event. Currently, only "default " and
   *   "workingLocation" events can be created using the API. Extended support for
   *   other event types will be made available in later releases.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventUpdateParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: EventUpdateParams.FocusTimeProperties;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventUpdateParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventUpdateParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: EventUpdateParams.OriginalStartTime;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: EventUpdateParams.OutOfOfficeProperties;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   */
  reminders?: EventUpdateParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventUpdateParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: EventUpdateParams.Start;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the event (as a RFC3339 timestamp).
   * Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: EventUpdateParams.WorkingLocationProperties;
}

export namespace EventUpdateParams {
  export interface Attachment {
    /**
     * ID of the attached file. Read-only. For Google Drive files, this is the ID of
     * the corresponding Files resource entry in the Drive API.
     */
    fileId?: string;

    /**
     * URL link to the attachment. For adding Google Drive file attachments use the
     * same format as in alternateLink property of the Files resource in the Drive API.
     * Required when adding an attachment.
     */
    fileUrl?: string;

    /**
     * URL link to the attachment's icon. This field can only be modified for custom
     * third-party attachments.
     */
    iconLink?: string;

    /**
     * Internet media type (MIME type) of the attachment.
     */
    mimeType?: string;

    /**
     * Attachment title.
     */
    title?: string;
  }

  export interface Attendee {
    /**
     * The attendee's Profile ID, if available.
     */
    id?: string;

    /**
     * Number of additional guests. Optional. The default is 0.
     */
    additionalGuests?: number;

    /**
     * The attendee's response comment. Optional.
     */
    comment?: string;

    /**
     * The attendee's name, if available. Optional.
     */
    displayName?: string;

    /**
     * The attendee's email address, if available. This field must be present when
     * adding an attendee. It must be a valid email address as per RFC5322. Required
     * when adding an attendee.
     */
    email?: string;

    /**
     * Whether this is an optional attendee. Optional. The default is False.
     */
    optional?: boolean;

    /**
     * Whether the attendee is the organizer of the event. Read-only. The default is
     * False.
     */
    organizer?: boolean;

    /**
     * Whether the attendee is a resource. Can only be set when the attendee is added
     * to the event for the first time. Subsequent modifications are ignored. Optional.
     * The default is False.
     */
    resource?: boolean;

    /**
     * The attendee's response status. Possible values are:
     *
     * - "needsAction" - The attendee has not responded to the invitation (recommended
     *   for new events).
     * - "declined" - The attendee has declined the invitation.
     * - "tentative" - The attendee has tentatively accepted the invitation.
     * - "accepted" - The attendee has accepted the invitation. Warning: If you add an
     *   event using the values declined, tentative, or accepted, attendees with the
     *   "Add invitations to my calendar" setting set to "When I respond to invitation
     *   in email" won't see an event on their calendar unless they choose to change
     *   their invitation response in the event invitation email.
     */
    responseStatus?: string;

    /**
     * Whether this entry represents the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  export interface ConferenceData {
    /**
     * The ID of the conference. Can be used by developers to keep track of
     * conferences, should not be displayed to users. The ID value is formed
     * differently for each conference solution type:
     *
     * - eventHangout: ID is not set. (This conference type is deprecated.)
     * - eventNamedHangout: ID is the name of the Hangout. (This conference type is
     *   deprecated.)
     * - hangoutsMeet: ID is the 10-letter meeting code, for example aaa-bbbb-ccc.
     * - addOn: ID is defined by the third-party provider. Optional.
     */
    conferenceId?: string;

    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    conferenceSolution?: ConferenceData.ConferenceSolution;

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    createRequest?: ConferenceData.CreateRequest;

    /**
     * Information about individual conference entry points, such as URLs or phone
     * numbers. All of them must belong to the same conference. Either
     * conferenceSolution and at least one entryPoint, or createRequest is required.
     */
    entryPoints?: Array<ConferenceData.EntryPoint>;

    /**
     * Additional notes (such as instructions from the domain administrator, legal
     * notices) to display to the user. Can contain HTML. The maximum length is 2048
     * characters. Optional.
     */
    notes?: string;

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    parameters?: ConferenceData.Parameters;

    /**
     * The signature of the conference data. Generated on server side. Unset for a
     * conference with a failed create request. Optional for a conference with a
     * pending create request.
     */
    signature?: string;
  }

  export namespace ConferenceData {
    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    export interface ConferenceSolution {
      /**
       * The user-visible icon for this solution.
       */
      iconUri?: string;

      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      key?: ConferenceSolution.Key;

      /**
       * The user-visible name of this solution. Not localized.
       */
      name?: string;
    }

    export namespace ConferenceSolution {
      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      export interface Key {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }
    }

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    export interface CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      conferenceSolutionKey?: CreateRequest.ConferenceSolutionKey;

      /**
       * The client-generated unique ID for this request. Clients should regenerate this
       * ID for every new request. If an ID provided is the same as for the previous
       * request, the request is ignored.
       */
      requestId?: string;

      /**
       * The status of the conference create request.
       */
      status?: CreateRequest.Status;
    }

    export namespace CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      export interface ConferenceSolutionKey {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }

      /**
       * The status of the conference create request.
       */
      export interface Status {
        /**
         * The current status of the conference create request. Read-only. The possible
         * values are:
         *
         * - "pending": the conference create request is still being processed.
         * - "success": the conference create request succeeded, the entry points are
         *   populated.
         * - "failure": the conference create request failed, there are no entry points.
         */
        statusCode?: string;
      }
    }

    export interface EntryPoint {
      /**
       * The access code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      accessCode?: string;

      /**
       * Features of the entry point, such as being toll or toll-free. One entry point
       * can have multiple features. However, toll and toll-free cannot be both set on
       * the same entry point.
       */
      entryPointFeatures?: Array<string>;

      /**
       * The type of the conference entry point. Possible values are:
       *
       * - "video" - joining a conference over HTTP. A conference can have zero or one
       *   video entry point.
       * - "phone" - joining a conference by dialing a phone number. A conference can
       *   have zero or more phone entry points.
       * - "sip" - joining a conference over SIP. A conference can have zero or one sip
       *   entry point.
       * - "more" - further conference joining instructions, for example additional phone
       *   numbers. A conference can have zero or one more entry point. A conference with
       *   only a more entry point is not a valid conference.
       */
      entryPointType?: string;

      /**
       * The label for the URI. Visible to end users. Not localized. The maximum length
       * is 512 characters. Examples:
       *
       * - for video: meet.google.com/aaa-bbbb-ccc
       * - for phone: +1 123 268 2601
       * - for sip: 12345678@altostrat.com
       * - for more: should not be filled
       *   Optional.
       */
      label?: string;

      /**
       * The meeting code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      meetingCode?: string;

      /**
       * The passcode to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       */
      passcode?: string;

      /**
       * The password to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      password?: string;

      /**
       * The PIN to access the conference. The maximum length is 128 characters. When
       * creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      pin?: string;

      /**
       * The CLDR/ISO 3166 region code for the country associated with this phone access.
       * Example: "SE" for Sweden. Calendar backend will populate this field only for
       * EntryPointType.PHONE.
       */
      regionCode?: string;

      /**
       * The URI of the entry point. The maximum length is 1300 characters. Format:
       *
       * - for video, http: or https: schema is required.
       * - for phone, tel: schema is required. The URI should include the entire dial
       *   sequence (e.g., tel:+12345678900,,,123456789;1234).
       * - for sip, sip: schema is required, e.g., sip:12345678@myprovider.com.
       * - for more, http: or https: schema is required.
       */
      uri?: string;
    }

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    export interface Parameters {
      /**
       * Additional add-on specific data.
       */
      addOnParameters?: Parameters.AddOnParameters;
    }

    export namespace Parameters {
      /**
       * Additional add-on specific data.
       */
      export interface AddOnParameters {
        parameters?: Record<string, string>;
      }
    }
  }

  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  export interface End {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: Record<string, string>;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: Record<string, string>;
  }

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  export interface FocusTimeProperties {
    /**
     * Whether to decline meeting invitations which overlap Focus Time events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Focus Time event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * The status to mark the user in Chat and related products. This can be available
     * or doNotDisturb.
     */
    chatStatus?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: Record<string, string>;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  export interface OriginalStartTime {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  export interface OutOfOfficeProperties {
    /**
     * Whether to decline meeting invitations which overlap Out of office events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Out of office event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * Information about the event's reminders for the authenticated user.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<Reminders.Override>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  export namespace Reminders {
    export interface Override {
      /**
       * The method used by this reminder. Possible values are:
       *
       * - "email" - Reminders are sent via email.
       * - "popup" - Reminders are sent via a UI popup.
       *   Required when adding a reminder.
       */
      method?: string;

      /**
       * Number of minutes before the start of the event when the reminder should
       * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
       * when adding a reminder.
       */
      minutes?: number;
    }
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  export interface Start {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Working location event data.
   */
  export interface WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    customLocation?: WorkingLocationProperties.CustomLocation;

    /**
     * If present, specifies that the user is working at home.
     */
    homeOffice?: unknown;

    /**
     * If present, specifies that the user is working from an office.
     */
    officeLocation?: WorkingLocationProperties.OfficeLocation;

    /**
     * Type of the working location. Possible values are:
     *
     * - "homeOffice" - The user is working at home.
     * - "officeLocation" - The user is working from an office.
     * - "customLocation" - The user is working from a custom location. Any details are
     *   specified in a sub-field of the specified name, but this field may be missing
     *   if empty. Any other fields are ignored. Required when adding working location
     *   properties.
     */
    type?: string;
  }

  export namespace WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    export interface CustomLocation {
      /**
       * An optional extra label for additional information.
       */
      label?: string;
    }

    /**
     * If present, specifies that the user is working from an office.
     */
    export interface OfficeLocation {
      /**
       * An optional building identifier. This should reference a building ID in the
       * organization's Resources database.
       */
      buildingId?: string;

      /**
       * An optional desk identifier.
       */
      deskId?: string;

      /**
       * An optional floor identifier.
       */
      floorId?: string;

      /**
       * An optional floor section identifier.
       */
      floorSectionId?: string;

      /**
       * The office name that's displayed in Calendar Web and Mobile clients. We
       * recommend you reference a building name in the organization's Resources
       * database.
       */
      label?: string;
    }
  }
}

export interface EventListParams {
  /**
   * Data format for the response.
   */
  alt?: "json";

  /**
   * Deprecated and ignored.
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Event types to return. Optional. This parameter can be repeated multiple times
   * to return events of different types. The default is ["default", "focusTime",
   * "outOfOffice"].
   */
  eventTypes?: Array<
    "default" | "focusTime" | "outOfOffice" | "workingLocation"
  >;

  /**
   * Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Specifies an event ID in the iCalendar format to be provided in the response.
   * Optional. Use this if you want to search for an event by its iCalendar ID.
   */
  iCalUID?: string;

  /**
   * API key. Your API key identifies your project and provides you with API access,
   * quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * The maximum number of attendees to include in the response. If there are more
   * than the specified number of attendees, only the participant is returned.
   * Optional.
   */
  maxAttendees?: number;

  /**
   * Maximum number of events returned on one result page. The number of events in
   * the resulting page may be less than this value, or none at all, even if there
   * are more events matching the query. Incomplete pages can be detected by a
   * non-empty nextPageToken field in the response. By default the value is 250
   * events. The page size can never be larger than 2500 events. Optional.
   */
  maxResults?: number;

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * The order of the events returned in the result. Optional. The default is an
   * unspecified, stable order.
   */
  orderBy?: "startTime" | "updated";

  /**
   * Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Extended properties constraint specified as propertyName=value. Matches only
   * private properties. This parameter might be repeated multiple times to return
   * events that match all given constraints.
   */
  privateExtendedProperty?: Array<string>;

  /**
   * Free text search terms to find events that match these terms in the following
   * fields:
   *
   * - summary
   * - description
   * - location
   * - attendee's displayName
   * - attendee's email
   * - organizer's displayName
   * - organizer's email
   * - workingLocationProperties.officeLocation.buildingId
   * - workingLocationProperties.officeLocation.deskId
   * - workingLocationProperties.officeLocation.label
   * - workingLocationProperties.customLocation.label These search terms also match
   *   predefined keywords against all display title translations of working
   *   location, out-of-office, and focus-time events. For example, searching for
   *   "Office" or "Bureau" returns working location events of type officeLocation,
   *   whereas searching for "Out of office" or "Abwesend" returns out-of-office
   *   events. Optional.
   */
  q?: string;

  /**
   * An opaque string that represents a user for quota purposes. Must not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Extended properties constraint specified as propertyName=value. Matches only
   * shared properties. This parameter might be repeated multiple times to return
   * events that match all given constraints.
   */
  sharedExtendedProperty?: Array<string>;

  /**
   * Whether to include deleted events (with status equals "cancelled") in the
   * result. Cancelled instances of recurring events (but not the underlying
   * recurring event) will still be included if showDeleted and singleEvents are both
   * False. If showDeleted and singleEvents are both True, only single instances of
   * deleted events (but not the underlying recurring events) are returned. Optional.
   * The default is False.
   */
  showDeleted?: boolean;

  /**
   * Whether to include hidden invitations in the result. Optional. The default is
   * False.
   */
  showHiddenInvitations?: boolean;

  /**
   * Whether to expand recurring events into instances and only return single one-off
   * events and instances of recurring events, but not the underlying recurring
   * events themselves. Optional. The default is False.
   */
  singleEvents?: boolean;

  /**
   * Token obtained from the nextSyncToken field returned on the last page of results
   * from the previous list request. It makes the result of this list request contain
   * only entries that have changed since then. All events deleted since the previous
   * list request will always be in the result set and it is not allowed to set
   * showDeleted to False. There are several query parameters that cannot be
   * specified together with nextSyncToken to ensure consistency of the client state.
   *
   * These are:
   *
   * - iCalUID
   * - orderBy
   * - privateExtendedProperty
   * - q
   * - sharedExtendedProperty
   * - timeMin
   * - timeMax
   * - updatedMin All other query parameters should be the same as for the initial
   *   synchronization to avoid undefined behavior. If the syncToken expires, the
   *   server will respond with a 410 GONE response code and the client should clear
   *   its storage and perform a full synchronization without any syncToken. Learn
   *   more about incremental synchronization. Optional. The default is to return all
   *   entries.
   */
  syncToken?: string;

  /**
   * Upper bound (exclusive) for an event's start time to filter by. Optional. The
   * default is not to filter by start time. Must be an RFC3339 timestamp with
   * mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMin
   * is set, timeMax must be greater than timeMin.
   */
  timeMax?: string;

  /**
   * Lower bound (exclusive) for an event's end time to filter by. Optional. The
   * default is not to filter by end time. Must be an RFC3339 timestamp with
   * mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax
   * is set, timeMin must be smaller than timeMax.
   */
  timeMin?: string;

  /**
   * Time zone used in the response. Optional. The default is the time zone of the
   * calendar.
   */
  timeZone?: string;

  /**
   * Lower bound for an event's last modification time (as a RFC3339 timestamp) to
   * filter by. When specified, entries deleted since this time will always be
   * included regardless of showDeleted. Optional. The default is not to filter by
   * last modification time.
   */
  updatedMin?: string;

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventDeleteParams {
  /**
   * Path param: Calendar identifier. To retrieve calendar IDs call the
   * calendarList.list method. If you want to access the primary calendar of the
   * currently logged in user, use the "primary" keyword.
   */
  calendarId: string;

  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the deletion of the event. Note that some
   * emails might still be sent even if you set the value to false. The default is
   * false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the deletion of the
   * event.
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventImportParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Version number of conference data supported by the API client.
   * Version 0 assumes no conference data support and ignores conference data in the
   * event's body. Version 1 enables support for copying of ConferenceData as well as
   * for creating new conferences using the createRequest field of conferenceData.
   * The default is 0.
   */
  conferenceDataVersion?: number;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Whether API client performing operation supports event attachments.
   * Optional. The default is False.
   */
  supportsAttachments?: boolean;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: Opaque identifier of the event. When creating new single or
   * recurring events, you can specify their IDs. Provided IDs must follow these
   * rules:
   *
   * - characters allowed in the ID are those used in base32hex encoding, i.e.
   *   lowercase letters a-v and digits 0-9, see section 3.1.2 in RFC2938
   * - the length of the ID must be between 5 and 1024 characters
   * - the ID must be unique per calendar Due to the globally distributed nature of
   *   the system, we cannot guarantee that ID collisions will be detected at event
   *   creation time. To minimize the risk of collisions we recommend using an
   *   established UUID algorithm such as one described in RFC4122. If you do not
   *   specify an ID, it will be automatically generated by the server. Note that the
   *   icalUID and the id are not identical and only one of them should be supplied
   *   at event creation time. One difference in their semantics is that in recurring
   *   events, all occurrences of one event have different ids while they all share
   *   the same icalUIDs.
   */
  id?: string;

  /**
   * Body param: Whether anyone can invite themselves to the event (deprecated).
   * Optional. The default is False.
   */
  anyoneCanAddSelf?: boolean;

  /**
   * Body param: File attachments for the event. In order to modify attachments the
   * supportsAttachments request parameter should be set to true. There can be at
   * most 25 attachments per event,
   */
  attachments?: Array<EventImportParams.Attachment>;

  /**
   * Body param: The attendees of the event. See the Events with attendees guide for
   * more information on scheduling events with other calendar users. Service
   * accounts need to use domain-wide delegation of authority to populate the
   * attendee list.
   */
  attendees?: Array<EventImportParams.Attendee>;

  /**
   * Body param: Whether attendees may have been omitted from the event's
   * representation. When retrieving an event, this may be due to a restriction
   * specified by the maxAttendee query parameter. When updating an event, this can
   * be used to only update the participant's response. Optional. The default is
   * False.
   */
  attendeesOmitted?: boolean;

  /**
   * Body param: The color of the event. This is an ID referring to an entry in the
   * event section of the colors definition (see the colors endpoint). Optional.
   */
  colorId?: string;

  /**
   * Body param: The conference-related information, such as details of a Google Meet
   * conference. To create new conference details use the createRequest field. To
   * persist your changes, remember to set the conferenceDataVersion request
   * parameter to 1 for all event modification requests.
   */
  conferenceData?: EventImportParams.ConferenceData;

  /**
   * Body param: Creation time of the event (as a RFC3339 timestamp). Read-only.
   */
  created?: string;

  /**
   * Body param: The creator of the event. Read-only.
   */
  creator?: EventImportParams.Creator;

  /**
   * Body param: Description of the event. Can contain HTML. Optional.
   */
  description?: string;

  /**
   * Body param: The (exclusive) end time of the event. For a recurring event, this
   * is the end time of the first instance.
   */
  end?: EventImportParams.End;

  /**
   * Body param: Whether the end time is actually unspecified. An end time is still
   * provided for compatibility reasons, even if this attribute is set to True. The
   * default is False.
   */
  endTimeUnspecified?: boolean;

  /**
   * Body param: ETag of the resource.
   */
  etag?: string;

  /**
   * Body param: Specific type of the event. This cannot be modified after the event
   * is created. Possible values are:
   *
   * - "default" - A regular event or not further specified.
   * - "outOfOffice" - An out-of-office event.
   * - "focusTime" - A focus-time event.
   * - "workingLocation" - A working location event. Currently, only "default " and
   *   "workingLocation" events can be created using the API. Extended support for
   *   other event types will be made available in later releases.
   */
  eventType?: string;

  /**
   * Body param: Extended properties of the event.
   */
  extendedProperties?: EventImportParams.ExtendedProperties;

  /**
   * Body param: Focus Time event data. Used if eventType is focusTime.
   */
  focusTimeProperties?: EventImportParams.FocusTimeProperties;

  /**
   * Body param: A gadget that extends this event. Gadgets are deprecated; this
   * structure is instead only used for returning birthday calendar metadata.
   */
  gadget?: EventImportParams.Gadget;

  /**
   * Body param: Whether attendees other than the organizer can invite others to the
   * event. Optional. The default is True.
   */
  guestsCanInviteOthers?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can modify the event.
   * Optional. The default is False.
   */
  guestsCanModify?: boolean;

  /**
   * Body param: Whether attendees other than the organizer can see who the event's
   * attendees are. Optional. The default is True.
   */
  guestsCanSeeOtherGuests?: boolean;

  /**
   * Body param: An absolute link to the Google Hangout associated with this event.
   * Read-only.
   */
  hangoutLink?: string;

  /**
   * Body param: An absolute link to this event in the Google Calendar Web UI.
   * Read-only.
   */
  htmlLink?: string;

  /**
   * Body param: Event unique identifier as defined in RFC5545. It is used to
   * uniquely identify events accross calendaring systems and must be supplied when
   * importing events via the import method. Note that the iCalUID and the id are not
   * identical and only one of them should be supplied at event creation time. One
   * difference in their semantics is that in recurring events, all occurrences of
   * one event have different ids while they all share the same iCalUIDs. To retrieve
   * an event using its iCalUID, call the events.list method using the iCalUID
   * parameter. To retrieve an event using its id, call the events.get method.
   */
  iCalUID?: string;

  /**
   * Body param: Type of the resource ("calendar#event").
   */
  kind?: string;

  /**
   * Body param: Geographic location of the event as free-form text. Optional.
   */
  location?: string;

  /**
   * Body param: Whether this is a locked event copy where no changes can be made to
   * the main event fields "summary", "description", "location", "start", "end" or
   * "recurrence". The default is False. Read-Only.
   */
  locked?: boolean;

  /**
   * Body param: The organizer of the event. If the organizer is also an attendee,
   * this is indicated with a separate entry in attendees with the organizer field
   * set to True. To change the organizer, use the move operation. Read-only, except
   * when importing an event.
   */
  organizer?: EventImportParams.Organizer;

  /**
   * Body param: For an instance of a recurring event, this is the time at which this
   * event would start according to the recurrence data in the recurring event
   * identified by recurringEventId. It uniquely identifies the instance within the
   * recurring event series even if the instance was moved to a different time.
   * Immutable.
   */
  originalStartTime?: EventImportParams.OriginalStartTime;

  /**
   * Body param: Out of office event data. Used if eventType is outOfOffice.
   */
  outOfOfficeProperties?: EventImportParams.OutOfOfficeProperties;

  /**
   * Body param: If set to True, Event propagation is disabled. Note that it is not
   * the same thing as Private event properties. Optional. Immutable. The default is
   * False.
   */
  privateCopy?: boolean;

  /**
   * Body param: List of RRULE, EXRULE, RDATE and EXDATE lines for a recurring event,
   * as specified in RFC5545. Note that DTSTART and DTEND lines are not allowed in
   * this field; event start and end times are specified in the start and end fields.
   * This field is omitted for single events or instances of recurring events.
   */
  recurrence?: Array<string>;

  /**
   * Body param: For an instance of a recurring event, this is the id of the
   * recurring event to which this instance belongs. Immutable.
   */
  recurringEventId?: string;

  /**
   * Body param: Information about the event's reminders for the authenticated user.
   */
  reminders?: EventImportParams.Reminders;

  /**
   * Body param: Sequence number as per iCalendar.
   */
  sequence?: number;

  /**
   * Body param: Source from which the event was created. For example, a web page, an
   * email message or any document identifiable by an URL with HTTP or HTTPS scheme.
   * Can only be seen or modified by the creator of the event.
   */
  source?: EventImportParams.Source;

  /**
   * Body param: The (inclusive) start time of the event. For a recurring event, this
   * is the start time of the first instance.
   */
  start?: EventImportParams.Start;

  /**
   * Body param: Status of the event. Optional. Possible values are:
   *
   * - "confirmed" - The event is confirmed. This is the default status.
   * - "tentative" - The event is tentatively confirmed.
   * - "cancelled" - The event is cancelled (deleted). The list method returns
   *   cancelled events only on incremental sync (when syncToken or updatedMin are
   *   specified) or if the showDeleted flag is set to true. The get method always
   *   returns them. A cancelled status represents two different states depending on
   *   the event type:
   * - Cancelled exceptions of an uncancelled recurring event indicate that this
   *   instance should no longer be presented to the user. Clients should store these
   *   events for the lifetime of the parent recurring event. Cancelled exceptions
   *   are only guaranteed to have values for the id, recurringEventId and
   *   originalStartTime fields populated. The other fields might be empty.
   * - All other cancelled events represent deleted events. Clients should remove
   *   their locally synced copies. Such cancelled events will eventually disappear,
   *   so do not rely on them being available indefinitely. Deleted events are only
   *   guaranteed to have the id field populated. On the organizer's calendar,
   *   cancelled events continue to expose event details (summary, location, etc.) so
   *   that they can be restored (undeleted). Similarly, the events to which the user
   *   was invited and that they manually removed continue to provide details.
   *   However, incremental sync requests with showDeleted set to false will not
   *   return these details. If an event changes its organizer (for example via the
   *   move operation) and the original organizer is not on the attendee list, it
   *   will leave behind a cancelled event where only the id field is guaranteed to
   *   be populated.
   */
  status?: string;

  /**
   * Body param: Title of the event.
   */
  summary?: string;

  /**
   * Body param: Whether the event blocks time on the calendar. Optional. Possible
   * values are:
   *
   * - "opaque" - Default value. The event does block time on the calendar. This is
   *   equivalent to setting Show me as to Busy in the Calendar UI.
   * - "transparent" - The event does not block time on the calendar. This is
   *   equivalent to setting Show me as to Available in the Calendar UI.
   */
  transparency?: string;

  /**
   * Body param: Last modification time of the event (as a RFC3339 timestamp).
   * Read-only.
   */
  updated?: string;

  /**
   * Body param: Visibility of the event. Optional. Possible values are:
   *
   * - "default" - Uses the default visibility for events on the calendar. This is
   *   the default value.
   * - "public" - The event is public and event details are visible to all readers of
   *   the calendar.
   * - "private" - The event is private and only event attendees may view event
   *   details.
   * - "confidential" - The event is private. This value is provided for
   *   compatibility reasons.
   */
  visibility?: string;

  /**
   * Body param: Working location event data.
   */
  workingLocationProperties?: EventImportParams.WorkingLocationProperties;
}

export namespace EventImportParams {
  export interface Attachment {
    /**
     * ID of the attached file. Read-only. For Google Drive files, this is the ID of
     * the corresponding Files resource entry in the Drive API.
     */
    fileId?: string;

    /**
     * URL link to the attachment. For adding Google Drive file attachments use the
     * same format as in alternateLink property of the Files resource in the Drive API.
     * Required when adding an attachment.
     */
    fileUrl?: string;

    /**
     * URL link to the attachment's icon. This field can only be modified for custom
     * third-party attachments.
     */
    iconLink?: string;

    /**
     * Internet media type (MIME type) of the attachment.
     */
    mimeType?: string;

    /**
     * Attachment title.
     */
    title?: string;
  }

  export interface Attendee {
    /**
     * The attendee's Profile ID, if available.
     */
    id?: string;

    /**
     * Number of additional guests. Optional. The default is 0.
     */
    additionalGuests?: number;

    /**
     * The attendee's response comment. Optional.
     */
    comment?: string;

    /**
     * The attendee's name, if available. Optional.
     */
    displayName?: string;

    /**
     * The attendee's email address, if available. This field must be present when
     * adding an attendee. It must be a valid email address as per RFC5322. Required
     * when adding an attendee.
     */
    email?: string;

    /**
     * Whether this is an optional attendee. Optional. The default is False.
     */
    optional?: boolean;

    /**
     * Whether the attendee is the organizer of the event. Read-only. The default is
     * False.
     */
    organizer?: boolean;

    /**
     * Whether the attendee is a resource. Can only be set when the attendee is added
     * to the event for the first time. Subsequent modifications are ignored. Optional.
     * The default is False.
     */
    resource?: boolean;

    /**
     * The attendee's response status. Possible values are:
     *
     * - "needsAction" - The attendee has not responded to the invitation (recommended
     *   for new events).
     * - "declined" - The attendee has declined the invitation.
     * - "tentative" - The attendee has tentatively accepted the invitation.
     * - "accepted" - The attendee has accepted the invitation. Warning: If you add an
     *   event using the values declined, tentative, or accepted, attendees with the
     *   "Add invitations to my calendar" setting set to "When I respond to invitation
     *   in email" won't see an event on their calendar unless they choose to change
     *   their invitation response in the event invitation email.
     */
    responseStatus?: string;

    /**
     * Whether this entry represents the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The conference-related information, such as details of a Google Meet conference.
   * To create new conference details use the createRequest field. To persist your
   * changes, remember to set the conferenceDataVersion request parameter to 1 for
   * all event modification requests.
   */
  export interface ConferenceData {
    /**
     * The ID of the conference. Can be used by developers to keep track of
     * conferences, should not be displayed to users. The ID value is formed
     * differently for each conference solution type:
     *
     * - eventHangout: ID is not set. (This conference type is deprecated.)
     * - eventNamedHangout: ID is the name of the Hangout. (This conference type is
     *   deprecated.)
     * - hangoutsMeet: ID is the 10-letter meeting code, for example aaa-bbbb-ccc.
     * - addOn: ID is defined by the third-party provider. Optional.
     */
    conferenceId?: string;

    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    conferenceSolution?: ConferenceData.ConferenceSolution;

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    createRequest?: ConferenceData.CreateRequest;

    /**
     * Information about individual conference entry points, such as URLs or phone
     * numbers. All of them must belong to the same conference. Either
     * conferenceSolution and at least one entryPoint, or createRequest is required.
     */
    entryPoints?: Array<ConferenceData.EntryPoint>;

    /**
     * Additional notes (such as instructions from the domain administrator, legal
     * notices) to display to the user. Can contain HTML. The maximum length is 2048
     * characters. Optional.
     */
    notes?: string;

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    parameters?: ConferenceData.Parameters;

    /**
     * The signature of the conference data. Generated on server side. Unset for a
     * conference with a failed create request. Optional for a conference with a
     * pending create request.
     */
    signature?: string;
  }

  export namespace ConferenceData {
    /**
     * The conference solution, such as Google Meet. Unset for a conference with a
     * failed create request. Either conferenceSolution and at least one entryPoint, or
     * createRequest is required.
     */
    export interface ConferenceSolution {
      /**
       * The user-visible icon for this solution.
       */
      iconUri?: string;

      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      key?: ConferenceSolution.Key;

      /**
       * The user-visible name of this solution. Not localized.
       */
      name?: string;
    }

    export namespace ConferenceSolution {
      /**
       * The key which can uniquely identify the conference solution for this event.
       */
      export interface Key {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }
    }

    /**
     * A request to generate a new conference and attach it to the event. The data is
     * generated asynchronously. To see whether the data is present check the status
     * field. Either conferenceSolution and at least one entryPoint, or createRequest
     * is required.
     */
    export interface CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      conferenceSolutionKey?: CreateRequest.ConferenceSolutionKey;

      /**
       * The client-generated unique ID for this request. Clients should regenerate this
       * ID for every new request. If an ID provided is the same as for the previous
       * request, the request is ignored.
       */
      requestId?: string;

      /**
       * The status of the conference create request.
       */
      status?: CreateRequest.Status;
    }

    export namespace CreateRequest {
      /**
       * The conference solution, such as Hangouts or Google Meet.
       */
      export interface ConferenceSolutionKey {
        /**
         * The conference solution type. If a client encounters an unfamiliar or empty
         * type, it should still be able to display the entry points. However, it should
         * disallow modifications. The possible values are:
         *
         * - "eventHangout" for Hangouts for consumers (deprecated; existing events may
         *   show this conference solution type but new conferences cannot be created)
         * - "eventNamedHangout" for classic Hangouts for Google Workspace users
         *   (deprecated; existing events may show this conference solution type but new
         *   conferences cannot be created)
         * - "hangoutsMeet" for Google Meet (http://meet.google.com)
         * - "addOn" for 3P conference providers
         */
        type?: string;
      }

      /**
       * The status of the conference create request.
       */
      export interface Status {
        /**
         * The current status of the conference create request. Read-only. The possible
         * values are:
         *
         * - "pending": the conference create request is still being processed.
         * - "success": the conference create request succeeded, the entry points are
         *   populated.
         * - "failure": the conference create request failed, there are no entry points.
         */
        statusCode?: string;
      }
    }

    export interface EntryPoint {
      /**
       * The access code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      accessCode?: string;

      /**
       * Features of the entry point, such as being toll or toll-free. One entry point
       * can have multiple features. However, toll and toll-free cannot be both set on
       * the same entry point.
       */
      entryPointFeatures?: Array<string>;

      /**
       * The type of the conference entry point. Possible values are:
       *
       * - "video" - joining a conference over HTTP. A conference can have zero or one
       *   video entry point.
       * - "phone" - joining a conference by dialing a phone number. A conference can
       *   have zero or more phone entry points.
       * - "sip" - joining a conference over SIP. A conference can have zero or one sip
       *   entry point.
       * - "more" - further conference joining instructions, for example additional phone
       *   numbers. A conference can have zero or one more entry point. A conference with
       *   only a more entry point is not a valid conference.
       */
      entryPointType?: string;

      /**
       * The label for the URI. Visible to end users. Not localized. The maximum length
       * is 512 characters. Examples:
       *
       * - for video: meet.google.com/aaa-bbbb-ccc
       * - for phone: +1 123 268 2601
       * - for sip: 12345678@altostrat.com
       * - for more: should not be filled
       *   Optional.
       */
      label?: string;

      /**
       * The meeting code to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      meetingCode?: string;

      /**
       * The passcode to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       */
      passcode?: string;

      /**
       * The password to access the conference. The maximum length is 128 characters.
       * When creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      password?: string;

      /**
       * The PIN to access the conference. The maximum length is 128 characters. When
       * creating new conference data, populate only the subset of {meetingCode,
       * accessCode, passcode, password, pin} fields that match the terminology that the
       * conference provider uses. Only the populated fields should be displayed.
       * Optional.
       */
      pin?: string;

      /**
       * The CLDR/ISO 3166 region code for the country associated with this phone access.
       * Example: "SE" for Sweden. Calendar backend will populate this field only for
       * EntryPointType.PHONE.
       */
      regionCode?: string;

      /**
       * The URI of the entry point. The maximum length is 1300 characters. Format:
       *
       * - for video, http: or https: schema is required.
       * - for phone, tel: schema is required. The URI should include the entire dial
       *   sequence (e.g., tel:+12345678900,,,123456789;1234).
       * - for sip, sip: schema is required, e.g., sip:12345678@myprovider.com.
       * - for more, http: or https: schema is required.
       */
      uri?: string;
    }

    /**
     * Additional properties related to a conference. An example would be a
     * solution-specific setting for enabling video streaming.
     */
    export interface Parameters {
      /**
       * Additional add-on specific data.
       */
      addOnParameters?: Parameters.AddOnParameters;
    }

    export namespace Parameters {
      /**
       * Additional add-on specific data.
       */
      export interface AddOnParameters {
        parameters?: Record<string, string>;
      }
    }
  }

  /**
   * The creator of the event. Read-only.
   */
  export interface Creator {
    /**
     * The creator's Profile ID, if available.
     */
    id?: string;

    /**
     * The creator's name, if available.
     */
    displayName?: string;

    /**
     * The creator's email address, if available.
     */
    email?: string;

    /**
     * Whether the creator corresponds to the calendar on which this copy of the event
     * appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * The (exclusive) end time of the event. For a recurring event, this is the end
   * time of the first instance.
   */
  export interface End {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Extended properties of the event.
   */
  export interface ExtendedProperties {
    /**
     * Properties that are private to the copy of the event that appears on this
     * calendar.
     */
    private?: Record<string, string>;

    /**
     * Properties that are shared between copies of the event on other attendees'
     * calendars.
     */
    shared?: Record<string, string>;
  }

  /**
   * Focus Time event data. Used if eventType is focusTime.
   */
  export interface FocusTimeProperties {
    /**
     * Whether to decline meeting invitations which overlap Focus Time events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Focus Time event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * The status to mark the user in Chat and related products. This can be available
     * or doNotDisturb.
     */
    chatStatus?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * A gadget that extends this event. Gadgets are deprecated; this structure is
   * instead only used for returning birthday calendar metadata.
   */
  export interface Gadget {
    /**
     * The gadget's display mode. Deprecated. Possible values are:
     *
     * - "icon" - The gadget displays next to the event's title in the calendar view.
     * - "chip" - The gadget displays when the event is clicked.
     */
    display?: string;

    /**
     * The gadget's height in pixels. The height must be an integer greater than 0.
     * Optional. Deprecated.
     */
    height?: number;

    /**
     * The gadget's icon URL. The URL scheme must be HTTPS. Deprecated.
     */
    iconLink?: string;

    /**
     * The gadget's URL. The URL scheme must be HTTPS. Deprecated.
     */
    link?: string;

    /**
     * Preferences.
     */
    preferences?: Record<string, string>;

    /**
     * The gadget's title. Deprecated.
     */
    title?: string;

    /**
     * The gadget's type. Deprecated.
     */
    type?: string;

    /**
     * The gadget's width in pixels. The width must be an integer greater than 0.
     * Optional. Deprecated.
     */
    width?: number;
  }

  /**
   * The organizer of the event. If the organizer is also an attendee, this is
   * indicated with a separate entry in attendees with the organizer field set to
   * True. To change the organizer, use the move operation. Read-only, except when
   * importing an event.
   */
  export interface Organizer {
    /**
     * The organizer's Profile ID, if available.
     */
    id?: string;

    /**
     * The organizer's name, if available.
     */
    displayName?: string;

    /**
     * The organizer's email address, if available. It must be a valid email address as
     * per RFC5322.
     */
    email?: string;

    /**
     * Whether the organizer corresponds to the calendar on which this copy of the
     * event appears. Read-only. The default is False.
     */
    self?: boolean;
  }

  /**
   * For an instance of a recurring event, this is the time at which this event would
   * start according to the recurrence data in the recurring event identified by
   * recurringEventId. It uniquely identifies the instance within the recurring event
   * series even if the instance was moved to a different time. Immutable.
   */
  export interface OriginalStartTime {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Out of office event data. Used if eventType is outOfOffice.
   */
  export interface OutOfOfficeProperties {
    /**
     * Whether to decline meeting invitations which overlap Out of office events. Valid
     * values are declineNone, meaning that no meeting invitations are declined;
     * declineAllConflictingInvitations, meaning that all conflicting meeting
     * invitations that conflict with the event are declined; and
     * declineOnlyNewConflictingInvitations, meaning that only new conflicting meeting
     * invitations which arrive while the Out of office event is present are to be
     * declined.
     */
    autoDeclineMode?: string;

    /**
     * Response message to set if an existing event or new invitation is automatically
     * declined by Calendar.
     */
    declineMessage?: string;
  }

  /**
   * Information about the event's reminders for the authenticated user.
   */
  export interface Reminders {
    /**
     * If the event doesn't use the default reminders, this lists the reminders
     * specific to the event, or, if not set, indicates that no reminders are set for
     * this event. The maximum number of override reminders is 5.
     */
    overrides?: Array<Reminders.Override>;

    /**
     * Whether the default reminders of the calendar apply to the event.
     */
    useDefault?: boolean;
  }

  export namespace Reminders {
    export interface Override {
      /**
       * The method used by this reminder. Possible values are:
       *
       * - "email" - Reminders are sent via email.
       * - "popup" - Reminders are sent via a UI popup.
       *   Required when adding a reminder.
       */
      method?: string;

      /**
       * Number of minutes before the start of the event when the reminder should
       * trigger. Valid values are between 0 and 40320 (4 weeks in minutes). Required
       * when adding a reminder.
       */
      minutes?: number;
    }
  }

  /**
   * Source from which the event was created. For example, a web page, an email
   * message or any document identifiable by an URL with HTTP or HTTPS scheme. Can
   * only be seen or modified by the creator of the event.
   */
  export interface Source {
    /**
     * Title of the source; for example a title of a web page or an email subject.
     */
    title?: string;

    /**
     * URL of the source pointing to a resource. The URL scheme must be HTTP or HTTPS.
     */
    url?: string;
  }

  /**
   * The (inclusive) start time of the event. For a recurring event, this is the
   * start time of the first instance.
   */
  export interface Start {
    /**
     * The date, in the format "yyyy-mm-dd", if this is an all-day event.
     */
    date?: string;

    /**
     * The time, as a combined date-time value (formatted according to RFC3339). A time
     * zone offset is required unless a time zone is explicitly specified in timeZone.
     */
    dateTime?: string;

    /**
     * The time zone in which the time is specified. (Formatted as an IANA Time Zone
     * Database name, e.g. "Europe/Zurich".) For recurring events this field is
     * required and specifies the time zone in which the recurrence is expanded. For
     * single events this field is optional and indicates a custom time zone for the
     * event start/end.
     */
    timeZone?: string;
  }

  /**
   * Working location event data.
   */
  export interface WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    customLocation?: WorkingLocationProperties.CustomLocation;

    /**
     * If present, specifies that the user is working at home.
     */
    homeOffice?: unknown;

    /**
     * If present, specifies that the user is working from an office.
     */
    officeLocation?: WorkingLocationProperties.OfficeLocation;

    /**
     * Type of the working location. Possible values are:
     *
     * - "homeOffice" - The user is working at home.
     * - "officeLocation" - The user is working from an office.
     * - "customLocation" - The user is working from a custom location. Any details are
     *   specified in a sub-field of the specified name, but this field may be missing
     *   if empty. Any other fields are ignored. Required when adding working location
     *   properties.
     */
    type?: string;
  }

  export namespace WorkingLocationProperties {
    /**
     * If present, specifies that the user is working from a custom location.
     */
    export interface CustomLocation {
      /**
       * An optional extra label for additional information.
       */
      label?: string;
    }

    /**
     * If present, specifies that the user is working from an office.
     */
    export interface OfficeLocation {
      /**
       * An optional building identifier. This should reference a building ID in the
       * organization's Resources database.
       */
      buildingId?: string;

      /**
       * An optional desk identifier.
       */
      deskId?: string;

      /**
       * An optional floor identifier.
       */
      floorId?: string;

      /**
       * An optional floor section identifier.
       */
      floorSectionId?: string;

      /**
       * The office name that's displayed in Calendar Web and Mobile clients. We
       * recommend you reference a building name in the organization's Resources
       * database.
       */
      label?: string;
    }
  }
}

export interface EventInstancesParams {
  /**
   * Path param: Calendar identifier. To retrieve calendar IDs call the
   * calendarList.list method. If you want to access the primary calendar of the
   * currently logged in user, use the "primary" keyword.
   */
  calendarId: string;

  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Deprecated and ignored. A value will always be returned in the
   * email field for the organizer, creator and attendees, even if no real email
   * address is available (i.e. a generated, non-working value will be provided).
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Maximum number of events returned on one result page. By default
   * the value is 250 events. The page size can never be larger than 2500 events.
   * Optional.
   */
  maxResults?: number;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: The original start time of the instance in the result. Optional.
   */
  originalStart?: string;

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Whether to include deleted events (with status equals "cancelled")
   * in the result. Cancelled instances of recurring events will still be included if
   * singleEvents is False. Optional. The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Upper bound (exclusive) for an event's start time to filter by.
   * Optional. The default is not to filter by start time. Must be an RFC3339
   * timestamp with mandatory time zone offset.
   */
  timeMax?: string;

  /**
   * Query param: Lower bound (inclusive) for an event's end time to filter by.
   * Optional. The default is not to filter by end time. Must be an RFC3339 timestamp
   * with mandatory time zone offset.
   */
  timeMin?: string;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventMoveParams {
  /**
   * Path param: Calendar identifier of the source calendar where the event currently
   * is on.
   */
  calendarId: string;

  /**
   * Query param: Calendar identifier of the target calendar where the event is to be
   * moved to.
   */
  destination: string;

  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the change of the event's organizer. Note
   * that some emails might still be sent even if you set the value to false. The
   * default is false.
   */
  sendNotifications?: boolean;

  /**
   * Query param: Guests who should receive notifications about the change of the
   * event's organizer.
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventQuickAddParams {
  /**
   * The text describing the event to be created.
   */
  text: string;

  /**
   * Data format for the response.
   */
  alt?: "json";

  /**
   * Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * API key. Your API key identifies your project and provides you with API access,
   * quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * An opaque string that represents a user for quota purposes. Must not exceed 40
   * characters.
   */
  quotaUser?: string;

  /**
   * Deprecated. Please use sendUpdates instead.
   *
   * Whether to send notifications about the creation of the event. Note that some
   * emails might still be sent even if you set the value to false. The default is
   * false.
   */
  sendNotifications?: boolean;

  /**
   * Guests who should receive notifications about the creation of the new event.
   */
  sendUpdates?: "all" | "externalOnly" | "none";

  /**
   * Deprecated. Please use quotaUser instead.
   */
  userIp?: string;
}

export interface EventWatchParams {
  /**
   * Query param: Data format for the response.
   */
  alt?: "json";

  /**
   * Query param: Deprecated and ignored.
   */
  alwaysIncludeEmail?: boolean;

  /**
   * Query param: Event types to return. Optional. This parameter can be repeated
   * multiple times to return events of different types. The default is ["default",
   * "focusTime", "outOfOffice"].
   */
  eventTypes?: Array<
    "default" | "focusTime" | "outOfOffice" | "workingLocation"
  >;

  /**
   * Query param: Selector specifying which fields to include in a partial response.
   */
  fields?: string;

  /**
   * Query param: Specifies an event ID in the iCalendar format to be provided in the
   * response. Optional. Use this if you want to search for an event by its iCalendar
   * ID.
   */
  iCalUID?: string;

  /**
   * Query param: API key. Your API key identifies your project and provides you with
   * API access, quota, and reports. Required unless you provide an OAuth 2.0 token.
   */
  key?: string;

  /**
   * Query param: The maximum number of attendees to include in the response. If
   * there are more than the specified number of attendees, only the participant is
   * returned. Optional.
   */
  maxAttendees?: number;

  /**
   * Query param: Maximum number of events returned on one result page. The number of
   * events in the resulting page may be less than this value, or none at all, even
   * if there are more events matching the query. Incomplete pages can be detected by
   * a non-empty nextPageToken field in the response. By default the value is 250
   * events. The page size can never be larger than 2500 events. Optional.
   */
  maxResults?: number;

  /**
   * Query param: OAuth 2.0 token for the current user.
   */
  oauth_token?: string;

  /**
   * Query param: The order of the events returned in the result. Optional. The
   * default is an unspecified, stable order.
   */
  orderBy?: "startTime" | "updated";

  /**
   * Query param: Token specifying which result page to return. Optional.
   */
  pageToken?: string;

  /**
   * Query param: Returns response with indentations and line breaks.
   */
  prettyPrint?: boolean;

  /**
   * Query param: Extended properties constraint specified as propertyName=value.
   * Matches only private properties. This parameter might be repeated multiple times
   * to return events that match all given constraints.
   */
  privateExtendedProperty?: Array<string>;

  /**
   * Query param: Free text search terms to find events that match these terms in the
   * following fields:
   *
   * - summary
   * - description
   * - location
   * - attendee's displayName
   * - attendee's email
   * - organizer's displayName
   * - organizer's email
   * - workingLocationProperties.officeLocation.buildingId
   * - workingLocationProperties.officeLocation.deskId
   * - workingLocationProperties.officeLocation.label
   * - workingLocationProperties.customLocation.label These search terms also match
   *   predefined keywords against all display title translations of working
   *   location, out-of-office, and focus-time events. For example, searching for
   *   "Office" or "Bureau" returns working location events of type officeLocation,
   *   whereas searching for "Out of office" or "Abwesend" returns out-of-office
   *   events. Optional.
   */
  q?: string;

  /**
   * Query param: An opaque string that represents a user for quota purposes. Must
   * not exceed 40 characters.
   */
  quotaUser?: string;

  /**
   * Query param: Extended properties constraint specified as propertyName=value.
   * Matches only shared properties. This parameter might be repeated multiple times
   * to return events that match all given constraints.
   */
  sharedExtendedProperty?: Array<string>;

  /**
   * Query param: Whether to include deleted events (with status equals "cancelled")
   * in the result. Cancelled instances of recurring events (but not the underlying
   * recurring event) will still be included if showDeleted and singleEvents are both
   * False. If showDeleted and singleEvents are both True, only single instances of
   * deleted events (but not the underlying recurring events) are returned. Optional.
   * The default is False.
   */
  showDeleted?: boolean;

  /**
   * Query param: Whether to include hidden invitations in the result. Optional. The
   * default is False.
   */
  showHiddenInvitations?: boolean;

  /**
   * Query param: Whether to expand recurring events into instances and only return
   * single one-off events and instances of recurring events, but not the underlying
   * recurring events themselves. Optional. The default is False.
   */
  singleEvents?: boolean;

  /**
   * Query param: Token obtained from the nextSyncToken field returned on the last
   * page of results from the previous list request. It makes the result of this list
   * request contain only entries that have changed since then. All events deleted
   * since the previous list request will always be in the result set and it is not
   * allowed to set showDeleted to False. There are several query parameters that
   * cannot be specified together with nextSyncToken to ensure consistency of the
   * client state.
   *
   * These are:
   *
   * - iCalUID
   * - orderBy
   * - privateExtendedProperty
   * - q
   * - sharedExtendedProperty
   * - timeMin
   * - timeMax
   * - updatedMin All other query parameters should be the same as for the initial
   *   synchronization to avoid undefined behavior. If the syncToken expires, the
   *   server will respond with a 410 GONE response code and the client should clear
   *   its storage and perform a full synchronization without any syncToken. Learn
   *   more about incremental synchronization. Optional. The default is to return all
   *   entries.
   */
  syncToken?: string;

  /**
   * Query param: Upper bound (exclusive) for an event's start time to filter by.
   * Optional. The default is not to filter by start time. Must be an RFC3339
   * timestamp with mandatory time zone offset, for example,
   * 2011-06-03T10:00:00-07:00, 2011-06-03T10:00:00Z. Milliseconds may be provided
   * but are ignored. If timeMin is set, timeMax must be greater than timeMin.
   */
  timeMax?: string;

  /**
   * Query param: Lower bound (exclusive) for an event's end time to filter by.
   * Optional. The default is not to filter by end time. Must be an RFC3339 timestamp
   * with mandatory time zone offset, for example, 2011-06-03T10:00:00-07:00,
   * 2011-06-03T10:00:00Z. Milliseconds may be provided but are ignored. If timeMax
   * is set, timeMin must be smaller than timeMax.
   */
  timeMin?: string;

  /**
   * Query param: Time zone used in the response. Optional. The default is the time
   * zone of the calendar.
   */
  timeZone?: string;

  /**
   * Query param: Lower bound for an event's last modification time (as a RFC3339
   * timestamp) to filter by. When specified, entries deleted since this time will
   * always be included regardless of showDeleted. Optional. The default is not to
   * filter by last modification time.
   */
  updatedMin?: string;

  /**
   * Query param: Deprecated. Please use quotaUser instead.
   */
  userIp?: string;

  /**
   * Body param: A UUID or similar unique string that identifies this channel.
   */
  id?: string;

  /**
   * Body param: An arbitrary string delivered to the target address with each
   * notification delivered over this channel. Optional.
   */
  token?: string;

  /**
   * Body param: The address where notifications are delivered for this channel.
   */
  address?: string;

  /**
   * Body param: Date and time of notification channel expiration, expressed as a
   * Unix timestamp, in milliseconds. Optional.
   */
  expiration?: string;

  /**
   * Body param: Identifies this as a notification channel used to watch for changes
   * to a resource, which is "api#channel".
   */
  kind?: string;

  /**
   * Body param: Additional parameters controlling delivery channel behavior.
   * Optional.
   */
  params?: Record<string, string>;

  /**
   * Body param: A Boolean value to indicate whether payload is wanted. Optional.
   */
  payload?: boolean;

  /**
   * Body param: An opaque ID that identifies the resource being watched on this
   * channel. Stable across different API versions.
   */
  resourceId?: string;

  /**
   * Body param: A version-specific identifier for the watched resource.
   */
  resourceUri?: string;

  /**
   * Body param: The type of delivery mechanism used for this channel. Valid values
   * are "web_hook" (or "webhook"). Both values refer to a channel where Http
   * requests are used to deliver messages.
   */
  type?: string;
}

export declare namespace Events {
  export {
    type Event as Event,
    type Events as Events,
    type EventCreateParams as EventCreateParams,
    type EventRetrieveParams as EventRetrieveParams,
    type EventUpdateParams as EventUpdateParams,
    type EventListParams as EventListParams,
    type EventDeleteParams as EventDeleteParams,
    type EventImportParams as EventImportParams,
    type EventInstancesParams as EventInstancesParams,
    type EventMoveParams as EventMoveParams,
    type EventQuickAddParams as EventQuickAddParams,
    type EventWatchParams as EventWatchParams,
  };
}
