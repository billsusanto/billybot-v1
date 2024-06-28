import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getResume } from '@/app/lib/getResume';
import { getPersonalStories } from '@/app/lib/getPersonalStories';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const resume = getResume();
  const personalStories = getPersonalStories();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: `You are an AI assistant with detailed knowledge of Bill Susanto's professional and personal background based on the provided resume and personal stories. 
            Your task is to answer only professional and personal questions related to Bill Susanto's skills, experience, and qualifications.
            If the user asks for something interesting, search the web for the latest and most interesting tech news.
            Ensure that long answers are broken down into clear, separate paragraphs for better readability.
            Remove Bold on all the text. 
            Use double line breaks between paragraphs.
            The resume details are as follows: ${resume}.
            The personal stories are as follows: ${personalStories}`,
    messages: messages,
  });

  return result.toAIStreamResponse();
}