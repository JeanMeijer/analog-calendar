import { createOpenAI } from "@ai-sdk/openai";
import type { KeyboardEventPredicate } from "@react-hookz/web";
import { generateObject } from "ai";
import { Temporal } from "temporal-polyfill";

import { aiInputSchema } from "@/lib/schemas/event-form";

export const generateEventFormData = async (
  userInput: string,
  apiKey: string,
) => {
  const currentTime = Temporal.Now.zonedDateTimeISO();
  const currentTimeString = currentTime.toLocaleString("en-GB", {
    weekday: "long",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
  });
  const openai = createOpenAI({
    apiKey,
  });
  const { object } = await generateObject({
    model: openai("gpt-4.1-mini"),
    schema: aiInputSchema,
    system: `You are helping users create calendar events from natural language input.

KEY REQUIREMENTS:
• Generate an object matching the expected schema based on user input
• Leave fields blank if user requests unsupported features (e.g. yearly repeats)
• Event title must be concise and short
• Description should NOT contain date/time info or repeat the title
• Description can include relevant links or context only if appropriate
• Default to today's date if no date/time specified
• Non-all-day events MUST have both start and end times, choose appropriate event duration based on context
• If start date is different from end date, repeat type MUST be provided
• If end date is not specified for repeating events, use the (start date + 1 year) as the end date

CURRENT TIME: ${currentTimeString}

Analyze the user's request and extract event details accordingly.`,
    prompt: `The user's input: '${userInput}'`,
  });
  return object;
};

export const aiInputPredicate: KeyboardEventPredicate = (e) => {
  if (!(e.target instanceof HTMLElement)) return false;
  if (e.target.id === "title") {
    const key = e.key ? e.key.toLowerCase() : "";
    return key === "enter" && e.metaKey;
  }
  return false;
};
