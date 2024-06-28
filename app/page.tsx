'use client';

import { useChat } from 'ai/react';
import { SendHorizonalIcon } from 'lucide-react';
import { FormEvent, useState, useEffect, useRef } from 'react';
import Typewriter from "typewriter-effect";
import emailjs from '@emailjs/browser';
import "./styles/chatAnimations.css";

export default function Home() {
  const { messages, input, setInput, handleInputChange, handleSubmit } =
    useChat({
      api: '/api/billybot/completion',
    });
    
    const stripFormatting = (text: string): string => {
      return text.replace(/(\*)/g, '');
    };
    
  const messagesList = messages.map((message) => (
    <div
      key={message.id}
      className={`my-2 text-md py-4 px-8 rounded-lg w-fit ${
        message.role === 'user'
          ? 'ml-auto bg-blue-100 text-blue-900 slide-in-right'
          : 'mr-auto mb-10 bg-gray-100 text-gray-900 slide-in-left'
      }`}
      style={{ whiteSpace: 'pre-line' }}
    >
      {stripFormatting(message.content)}
    </div>
  ));

  const [chatHistory, setChatHistory] = useState('');
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const [formMarginTop, setFormMarginTop] = useState('mt-10');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const updatedChatHistory = messages
      .map((message) => {
        return `${message.role === 'user' ? 'User' : 'Billybot'}: ${message.content}`;
      })
      .join('\n');
    setChatHistory(updatedChatHistory);
  }, [messages]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
      console.log(chatHistory);

      if (chatHistory !== '') {
        emailjs.send(
          'service_fb2fl4g',
          'template_j8okxwr',
          {
            from_name: 'Billybot',
            to_name: 'Bill',
            from_email: 'billsusanto01@gmail.com',
            to_email: 'billsusanto01@gmail.com',
            message: chatHistory
          },
          'lQgRj9ZyE7KvismHf'
        ).then((result) => {
          console.log('Email successfully sent!', result.text);
        }, (error) => {
          console.error('Failed to send email:', error.text);
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [chatHistory]);

  const customHandleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
    setInput('');
  };

  const exampleQuestions = [
    "Tell me more about Bill's experiences.",
    "What are Bill's vision and mission?",
    "Is Bill currently looking for an internship?",
    "Tell me something interesting!"
  ];

  const handleExampleClick = (question: string) => {
    setInput(question);
    setButtonsVisible(false);
    setFormMarginTop('mt-auto');
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }
    }, 0);
  };

  return (
    <div className="flex flex-col mt-14 items-center w-[100%] h-[80vh]">
      <div className="flex justify-center items-center text-center text-4xl">
        <span>Hey there, I&apos;m&nbsp;</span>
        <Typewriter
          options={{ loop: true }}
          onInit={(typewriter) => {
            typewriter
              .typeString("Bill Susanto ")
              .pauseFor(200)
              .deleteAll()
              .typeString("an aspiring Software Developer")
              .pauseFor(200)
              .deleteAll()
              .typeString("ready to Innovate and Inspire")
              .pauseFor(200)
              .deleteAll()
              .typeString("committed to Learning and Growth")
              .pauseFor(200)
              .deleteAll()
              .start()
          }}
        />
      </div>
      <p className="text-left mt-6 text-gray-500 text-xl">
        This is Billybot, my AI assistant who knows everything about me. 
      </p>
      <p className="text-left mt-0 text-gray-500 text-xl">
        Feel free to ask it anything you like, I&apos;m sure it&apos;s up to the task
        🔥
      </p>
      <div className="mt-4 w-[60%] text-md">{messagesList}</div>
      {buttonsVisible && (
        <div className="mt-4 w-[60%] flex flex-wrap gap-2 mt-auto justify-center">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(question)}
              className="py-2 px-4 bg-blue-500 text-white rounded-lg"
            >
              {question}
            </button>
          ))}
        </div>
      )}
      <form
        ref={formRef}
        className={`flex py-4 px-8 w-[60%] border-2 border-black rounded-xl mb-0 ${formMarginTop}`}
        onSubmit={customHandleSubmit}
      >
        <input
          name="prompt"
          className="h-8 w-[100%] text-black border-black focus:outline-none"
          value={input}
          onChange={handleInputChange}
          id="prompt"
          placeholder='Ask any questions about Bill...'
        />
        <button type="submit">
          <SendHorizonalIcon />
        </button>
      </form>
    </div>
  );
}