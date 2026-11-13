---
title: "ivi: AI tools and n8n automation workshop, Aman Aggarwal, 19 Jun 2025"
speaker: "Aman Aggarwal"
organisation: "AI Consultant"
date: "2025-06-19"
kind: "bootcamp"
transcript_quality: "poor, the transcript is short broken fragments with long gaps and much classroom chatter"
---

# AI tools and n8n automation workshop, Aman Aggarwal

Aman Aggarwal, an AI consultant who earlier worked on the data intelligence platform at Swiggy, ran a three hour tech bootcamp for the cohort. The first half was a talk and demo tour of AI tools for text, image, audio and video. The second half was a hands-on build in n8n, where everyone made a workflow that turns a form entry into a LinkedIn post and emails it.

## What was said

### Why AI now

- Aman Aggarwal says that before 2022 a team needed 5,000 to 50,000 data samples to make a machine follow instructions, and that now 3 to 5 examples are enough to get a model to do the task.
- He says the aim of AI is to be public for everyone, so that people can turn redundant daily tasks into automated workflows.
- He says a founder who starts using these tools now will have a very good assistant for many things within two years.
- He says that with AI automations and AI tools a founder can do many things alone that used to need a tech person.
- He says the tools improve every month, that in a year he will be recommending different things, and that founders have to keep upskilling and checking what new tools exist.
- He suggests building a bot that reports which tools were released in the last month.
- He says that for recommendation features a team can train a smaller model such as BERT instead of paying LLM costs, and that this is cheap, quick and a fixed cost.

### AI as an assistant

- He says AI is an assistant and nothing else. A founder has to learn the work first and then bring AI in.
- His advice is to build knowledge in one sector and then use AI as a system to automate that work.
- He says that without doing the work yourself first there will always be a limit on what you get from the current models.
- He defines an expert as the person who knows the most about failures in an industry and knows what works and what does not.
- He says practice shortens the work. His example is a first song made with an audio tool taking three to five days, and the second one going much faster because of what was learned.
- He says an AI product acts on its prompting, which is not always right or specific, so it can drift away from the instructions.
- He says AI is cheap compared with people but still costs money, and that good output needs many iterations.
- He says a founder should know the scope of what can be automated even when someone else builds it.

### Tools he showed

- For text he named ChatGPT, Copy.ai and Jasper.
- He says the GPT image model makes realistic images and can place a product in a person's hand.
- He says a team using image models needs a routine for checking whether another model has started doing better.
- He describes NotebookLM by Google as a tool that takes Google Drive documents, your own documents, YouTube links and website links as sources, and says it can take 10, 20 or 30 sources.
- He says a listener can interact with NotebookLM while its audio is playing.
- He showed Suno for making music from a short prompt and made a rap song in class.
- He named Kling as a good tool for making videos and LTX Studio for making a whole series.
- He called ElevenLabs his personal favourite for voice, and named Murf for voice-overs in videos.
- He named Trupeer as a tool that hears your voice and makes the transcript, which can be used for captions.
- He says there are many AI note takers that can sit in a meeting.
- He showed an app builder that turned a short prompt for an attendance platform into a working web application with a preview.
- He says such builders make web applications and progressive web apps but not mobile apps, and that the e-commerce sites they make are functional but not visually appealing.
- He played a demo video of a no-code workflow that takes a product photo, name and description from a form, generates an image and a ten second product video, and emails both.
- He says an AI agent can ask leads questions and pick out the best ones from a thousand based on their answers.

### Prompting

- He says that when building AI agents for a company, one big prompt has many chances of failure, and that this is where reactive prompting differs.
- In the build he called the method reactive prompting: run the agent, look at the output, then edit the system message until the output fits the requirement.
- He says the system message is where you tell the agent how to convert the input, and that it can also set the tone.
- He says that to change what the agent searches for or returns, you change the system prompt.

### Automation platforms

- Asked which platform suits a simple use case, he suggested Zapier for someone who knows nothing about automation. The class used n8n.
- He says n8n can be deployed locally using Docker.
- The hosted n8n version the class used was a 14 day trial.
- He says the cost of one AI-made post is less than half a dollar, about 50 rupees. A participant had said a person doing daily posts cost him 500 rupees a day.

### The hands-on build in n8n

- The workflow starts with a form trigger that has two fields, topic and target audience.
- The form output is dragged into an AI agent node as the prompt, and a system message is added as an option on that node.
- The class first tried one shared OpenAI API key. It failed to connect for most people, and he said one key cannot be used in many places at once.
- The class switched to a free Gemini API key from Google AI Studio and set the chat model to Gemini 2.0 Flash.
- He explains that using any platform's API needs that platform's API key.
- To give the agent real-time data he added Tavily as a tool. He says Tavily's free account gives 1,000 requests a month.
- Tavily was connected through an HTTP request node by importing a curl request, with the API key placed after the word Bearer.
- He describes a curl request as the way one platform connects with another, which is an API call.
- He says the system prompt has to state that the agent has the Tavily tool and must use it to get real-time data for the post.
- When an agent did not call the tool, his fix was to change the tool's name and description so the agent knows what it is for.
- He says the weaker model was the reason some agents skipped the tool, and suggests using OpenAI for your own builds.
- The last step was a Gmail node set to send a message. It needed a Google Cloud project with the Gmail API enabled and OAuth sign-in.
- He chose Gmail over a simple email option because he says the Gmail connection will be useful in later builds.
- He told the class to keep saving their work in n8n because unsaved work gets lost.
- He says posting straight to LinkedIn from n8n is possible once the workflow is given the LinkedIn permissions.

## Examples and cases used

- Swiggy: he worked on its data intelligence platform and used it to show how many separate teams a large tech company has, such as delivery, data, deployment automation and consumer satisfaction.
- A friend's healthy snacking company: the founder does all the marketing himself with AI, posting daily and making videos.
- Suno: a rap song made in class from a short prompt.
- NotebookLM: many sources in, an audio discussion out that the listener can interrupt.

## Numbers given

- 5,000 to 50,000 data samples, his figure for what a model needed before 2022, against 3 to 5 examples now.
- Less than half a dollar, about 50 rupees, his estimate of the cost of one AI-made post.
- 1,000 requests a month, what he says Tavily's free account allows.
- 14 days, the length of the n8n trial the class used.

## Not covered

- How to check AI output for factual errors before it is posted.
- Data privacy when giving company documents or customer data to these tools.
- Image generation inside the workflow. The emailed post was text only.
- Posting to LinkedIn directly. It was described but not built in class.
