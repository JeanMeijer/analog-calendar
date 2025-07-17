import { MeetingLink } from "./interfaces";

export const meetingServices = [
  {
    id: "meet",
    label: "Google Meet",
    regex: /https?:\/\/meet\.google\.com\/(_meet\/)?[a-z-]+/,
  },
  {
    id: "zoom",
    label: "Zoom",
    regex:
      /https:\/\/(?:[a-zA-Z0-9-.]+)?zoom(-x)?\.(?:us|com|com\.cn|de)\/(?:my|[a-z]{1,2}|webinar)\/[-a-zA-Z0-9()@:%_\+.~#?&=\/]*/,
  },
  {
    id: "zoom_native",
    label: "Zoom",
    regex:
      /zoommtg:\/\/([a-z0-9-.]+)?zoom(-x)?\.(?:us|com|com\.cn|de)\/join[-a-zA-Z0-9()@:%_\+.~#?&=\/]*/,
  },
  {
    id: "teams",
    label: "Microsoft Teams",
    regex:
      /https?:\/\/(gov\.)?teams\.microsoft\.(com|us)\/l\/meetup-join\/[a-zA-Z0-9_%\/=\-\+\.?]+/,
  },
  {
    id: "webex",
    label: "Webex",
    regex:
      /https?:\/\/(?:[A-Za-z0-9-]+\.)?webex\.com(?:(?:\/[-A-Za-z0-9]+\/j\.php\?MTID=[A-Za-z0-9]+(?:&\S*)?)|(?:\/(?:meet|join)\/[A-Za-z0-9\-._@]+(?:\?\S*)?))/,
  },
  {
    id: "chime",
    label: "Amazon Chime",
    regex: /https?:\/\/([a-z0-9-.]+)?chime\.aws\/[0-9]*/,
  },
  {
    id: "jitsi",
    label: "Jitsi Meet",
    regex: /https?:\/\/meet\.jit\.si\/[^\s]*/,
  },
  {
    id: "ringcentral",
    label: "RingCentral Video",
    regex: /https?:\/\/([a-z0-9.]+)?ringcentral\.com\/[^\s]*/,
  },
  {
    id: "gotomeeting",
    label: "GoToMeeting",
    regex: /https?:\/\/([a-z0-9.]+)?gotomeeting\.com\/[^\s]*/,
  },
  {
    id: "gotowebinar",
    label: "GoToWebinar",
    regex: /https?:\/\/([a-z0-9.]+)?gotowebinar\.com\/[^\s]*/,
  },
  {
    id: "bluejeans",
    label: "BlueJeans",
    regex: /https?:\/\/([a-z0-9.]+)?bluejeans\.com\/[^\s]*/,
  },
  {
    id: "eight_x_eight",
    label: "8x8 Meet",
    regex: /https?:\/\/8x8\.vc\/[^\s]*/,
  },
  {
    id: "demio",
    label: "Demio",
    regex: /https?:\/\/event\.demio\.com\/[^\s]*/,
  },
  { id: "join_me", label: "Join.me", regex: /https?:\/\/join\.me\/[^\s]*/ },
  { id: "whereby", label: "Whereby", regex: /https?:\/\/whereby\.com\/[^\s]*/ },
  {
    id: "uberconference",
    label: "UberConference",
    regex: /https?:\/\/uberconference\.com\/[^\s]*/,
  },
  { id: "blizz", label: "Blizz", regex: /https?:\/\/go\.blizz\.com\/[^\s]*/ },
  {
    id: "teamviewer_meeting",
    label: "TeamViewer Meeting",
    regex: /https?:\/\/go\.teamviewer\.com\/[^\s]*/,
  },
  { id: "vsee", label: "VSee", regex: /https?:\/\/vsee\.com\/[^\s]*/ },
  {
    id: "starleaf",
    label: "StarLeaf",
    regex: /https?:\/\/meet\.starleaf\.com\/[^\s]*/,
  },
  {
    id: "duo",
    label: "Google Duo",
    regex: /https?:\/\/duo\.app\.goo\.gl\/[^\s]*/,
  },
  {
    id: "voov",
    label: "VooV Meeting",
    regex: /https?:\/\/voovmeeting\.com\/[^\s]*/,
  },
  {
    id: "facebook_workspace",
    label: "Workplace (Meta)",
    regex: /https?:\/\/([a-z0-9-.]+)?workplace\.com\/groupcall\/[^\s]+/,
  },
  { id: "skype", label: "Skype", regex: /https?:\/\/join\.skype\.com\/[^\s]*/ },
  {
    id: "lifesize",
    label: "Lifesize",
    regex: /https?:\/\/call\.lifesizecloud\.com\/[^\s]*/,
  },
  {
    id: "youtube",
    label: "YouTube",
    regex: /https?:\/\/((www|m)\.)?(youtube\.com|youtu\.be)\/[^\s]*/,
  },
  {
    id: "vonageMeetings",
    label: "Vonage Meetings",
    regex: /https?:\/\/meetings\.vonage\.com\/[0-9]{9}/,
  },
  {
    id: "meetStream",
    label: "Google Meet Stream",
    regex: /https?:\/\/stream\.meet\.google\.com\/stream\/[a-z0-9-]+/,
  },
  {
    id: "around",
    label: "Around",
    regex: /https?:\/\/(meet\.)?around\.co\/[^\s]*/,
  },
  { id: "jam", label: "Jam Systems", regex: /https?:\/\/jam\.systems\/[^\s]*/ },
  {
    id: "discord",
    label: "Discord",
    regex:
      /(http|https|discord):\/\/(www\.)?(canary\.)?discord(app)?\.([a-zA-Z]{2,})(.+)?/,
  },
  {
    id: "blackboard_collab",
    label: "Blackboard Collaborate",
    regex: /https?:\/\/us\.bbcollab\.com\/[^\s]*/,
  },
  {
    id: "coscreen",
    label: "CoScreen",
    regex: /https?:\/\/join\.coscreen\.co\/[^\s]*/,
  },
  {
    id: "vowel",
    label: "Vowel",
    regex: /https?:\/\/([a-z0-9.]+)?vowel\.com\/#\/g\/[^\s]*/,
  },
  {
    id: "zhumu",
    label: "Zhumu",
    regex: /https:\/\/welink\.zhumu\.com\/j\/[0-9]+?pwd=[a-zA-Z0-9]+/,
  },
  {
    id: "lark",
    label: "Lark Video Meeting",
    regex: /https:\/\/vc\.larksuite\.com\/j\/[0-9]+/,
  },
  {
    id: "feishu",
    label: "Feishu Video Meeting",
    regex: /https:\/\/vc\.feishu\.cn\/j\/[0-9]+/,
  },
  {
    id: "vimeo",
    label: "Vimeo",
    regex:
      /https:\/\/vimeo\.com\/(showcase|event)\/[0-9]+|https:\/\/venues\.vimeo\.com\/[^\s]+/,
  },
  {
    id: "ovice",
    label: "oVice",
    regex: /https:\/\/([a-z0-9-.]+)?ovice\.in\/[^\s]*/,
  },
  {
    id: "facetime",
    label: "FaceTime",
    regex: /https:\/\/facetime\.apple\.com\/join[^\s]*/,
  },
  {
    id: "chorus",
    label: "Chorus.ai",
    regex: /https?:\/\/go\.chorus\.ai\/[^\s]+/,
  },
  { id: "pop", label: "Pop", regex: /https?:\/\/pop\.com\/j\/[0-9-]+/ },
  {
    id: "gong",
    label: "Gong",
    regex: /https?:\/\/([a-z0-9-.]+)?join\.gong\.io\/[^\s]+/,
  },
  {
    id: "livestorm",
    label: "Livestorm",
    regex: /https?:\/\/app\.livestorm\.com\/p\/[^\s]+/,
  },
  { id: "luma", label: "Luma", regex: /https:\/\/lu\.ma\/join\/[^\s]*/ },
  { id: "preply", label: "Preply", regex: /https:\/\/preply\.com\/[^\s]*/ },
  {
    id: "userzoom",
    label: "UserZoom",
    regex: /https:\/\/go\.userzoom\.com\/participate\/[a-z0-9-]+/,
  },
  {
    id: "venue",
    label: "Venue Live",
    regex: /https:\/\/app\.venue\.live\/app\/[^\s]*/,
  },
  {
    id: "teemyco",
    label: "Teemyco",
    regex: /https:\/\/app\.teemyco\.com\/room\/[^\s]*/,
  },
  {
    id: "demodesk",
    label: "Demodesk",
    regex: /https:\/\/demodesk\.com\/[^\s]*/,
  },
  {
    id: "zoho_cliq",
    label: "Zoho Cliq",
    regex: /https:\/\/cliq\.zoho\.eu\/meetings\/[^\s]*/,
  },
  {
    id: "zoomgov",
    label: "ZoomGov",
    regex: /https?:\/\/([a-z0-9.]+)?zoomgov\.com\/j\/[a-zA-Z0-9?&=]+/,
  },
  {
    id: "skype4biz",
    label: "Skype for Business",
    regex: /https?:\/\/meet\.lync\.com\/[^\s]*/,
  },
  {
    id: "skype4biz_selfhosted",
    label: "Skype for Business (self-hosted)",
    regex: /https?:\/\/(meet|join)\.[^\s]*\/[a-z0-9.]+\/meet\/[A-Za-z0-9.\/]+/,
  },
  {
    id: "hangouts",
    label: "Google Hangouts",
    regex: /https?:\/\/hangouts\.google\.com\/[^\s]*/,
  },
  {
    id: "slack",
    label: "Slack Huddle",
    regex: /https?:\/\/app\.slack\.com\/huddle\/[A-Za-z0-9.\/]+/,
  },
  {
    id: "reclaim",
    label: "Reclaim AI",
    regex: /https?:\/\/reclaim\.ai\/z\/[A-Za-z0-9.\/]+/,
  },
  { id: "tuple", label: "Tuple", regex: /https:\/\/tuple\.app\/c\/[^\s]*/ },
  {
    id: "gather",
    label: "Gather Town",
    regex:
      /https?:\/\/app\.gather\.town\/app\/[A-Za-z0-9]+\/[A-Za-z0-9_%\-]+\?(spawnToken|meeting)=[^\s]*/,
  },
  {
    id: "pumble",
    label: "Pumble Meet",
    regex: /https?:\/\/meet\.pumble\.com\/[a-z-]+/,
  },
  {
    id: "suitConference",
    label: "Suit Conference",
    regex: /https?:\/\/([a-z0-9.]+)?conference\.istesuit\.com\/[^\s]*/,
  },
  {
    id: "doxyMe",
    label: "Doxy.me",
    regex: /https:\/\/([a-z0-9.]+)?doxy\.me\/[^\s]*/,
  },
  {
    id: "calcom",
    label: "Cal.com Video",
    regex: /https?:\/\/app\.cal\.com\/video\/[A-Za-z0-9.\/]+/,
  },
  {
    id: "zmPage",
    label: "Zoom Page",
    regex: /https?:\/\/([a-zA-Z0-9.]+)\.zm\.page/,
  },
  {
    id: "livekit",
    label: "LiveKit",
    regex: /https?:\/\/meet[a-zA-Z0-9.]*\.livekit\.io\/rooms\/[a-zA-Z0-9-#]+/,
  },
  {
    id: "meetecho",
    label: "Meetecho",
    regex: /https?:\/\/meetings\.conf\.meetecho\.com\/.+/,
  },
  {
    id: "streamyard",
    label: "StreamYard",
    regex:
      /https:\/\/(?:www\.)?streamyard\.com\/(?:guest\/)?([a-z0-9]{8,13})(?:\/|\?[^ \n]*)?/,
  },
] as const;

/**
 * Return the service key that matches a URL (or `undefined` if none do).
 */
export function detectMeetingLink(url: string): MeetingLink | null {
  if (!url.startsWith("https://")) {
    return null;
  }

  const service = meetingServices.find((service) => service.regex.test(url));

  if (!service) {
    return null;
  }

  return {
    id: service.id,
    name: service.label,
    joinUrl: url,
  };
}
