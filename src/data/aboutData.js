// data/aboutData.js

import {
  Zap,
  Network,
  GitBranch,
  Eye,
  BarChart2,
  Layers,
} from "lucide-react";

const aboutData = {
  hero: {
    tagline: "ECOINTERACT",
    headline: "Nature Doesn't Teach in Chapters.",
    subheadline: "It teaches in systems, cycles, and cascades.",
    philosophy:
      "This platform exists not to explain ecology — but to let you feel it.",
    scrollHint: "Scroll to explore",
  },

  problem: {
    sectionLabel: "The Problem",
    heading: "Why Students Struggle With Ecology",
    left: {
      label: "Traditional Learning",
      title: "Static. Fragmented. Forgotten.",
      points: [
        "Textbook diagrams freeze living systems into lifeless arrows.",
        "Topics are taught in isolation — energy flow here, succession there.",
        "Students memorize trophic levels without ever feeling the transfer.",
        "Abstract pyramids replace the lived reality of ecosystems.",
        "Understanding evaporates after the exam.",
      ],
    },
    right: {
      label: "Interactive Learning",
      title: "Dynamic. Connected. Retained.",
      points: [
        "Animated flows show energy moving through producers and consumers in real time.",
        "Food webs ripple and respond — remove one species, watch the cascade.",
        "Succession timelines bring decades of change to a single scroll.",
        "Visual metaphors replace jargon, creating lasting mental models.",
        "Concepts stick because they were experienced, not memorized.",
      ],
    },
  },

  features: {
    sectionLabel: "Capabilities",
    heading: "What EcoInteract Offers",
    cards: [
      {
        icon: Zap,
        title: "Energy Flow Visualization",
        description:
          "Watch energy transfer across trophic levels with animated flows that reveal the 10% rule in motion.",
      },
      {
        icon: Network,
        title: "Interactive Food Webs",
        description:
          "Explore interconnected species networks. Observe how removing one node reshapes the entire web.",
      },
      {
        icon: GitBranch,
        title: "Succession Timelines",
        description:
          "Simulate primary and secondary succession across decades — from bare rock to climax community.",
      },
      {
        icon: Eye,
        title: "Visual-First Design",
        description:
          "Every concept is paired with a diagram, animation, or interactive model before any text explanation.",
      },
      {
        icon: BarChart2,
        title: "Ecological Pyramids",
        description:
          "Dynamic pyramids of number, biomass, and energy that respond to your inputs and hypotheses.",
      },
      {
        icon: Layers,
        title: "Layered Complexity",
        description:
          "Start simple, go deep. Each topic unfolds in layers so learners at every level find their footing.",
      },
    ],
  },

  experiences: [
    {
      id: "energy",
      label: "01 — Energy Flow",
      title: "Trace Every Joule Through the Web of Life",
      description:
        "Energy enters ecosystems as sunlight and cascades downward through producers, herbivores, and carnivores. EcoInteract animates this transfer — you can literally watch 90% dissipate as heat at each level and understand why food chains rarely exceed five links. This isn't a diagram. It's a simulation.",
      stat: "~10%",
      statLabel: "energy transferred per trophic level",
      visual: "energy",
    },
    {
      id: "foodweb",
      label: "02 — Food Webs",
      title: "Pull One Thread. Watch the Whole Web Respond.",
      description:
        "Real ecosystems are not neat food chains — they are tangled, resilient webs. Remove a keystone predator and watch herbivore populations explode. Lose a primary producer and watch the cascade of starvation ripple upward. EcoInteract makes these invisible consequences visible, building ecological intuition through interaction.",
      stat: "∞",
      statLabel: "ripple effects from a single change",
      visual: "foodweb",
    },
    {
      id: "succession",
      label: "03 — Ecological Succession",
      title: "A Thousand Years of Change in One Scroll",
      description:
        "From volcanic rock to dense forest, from burned grassland back to woodland — succession is ecology's great slow drama. EcoInteract compresses these timescales into scrollable, interactive timelines. Watch pioneer species colonize bare substrate, give way to shrubs, then trees, then a stable climax community that will outlast every civilization.",
      stat: "1000+",
      statLabel: "years of succession in one interaction",
      visual: "succession",
    },
  ],

  philosophy: {
    preQuote: "Our guiding belief",
    quote:
      "The student who interacts with a system remembers it forever. The student who reads about it forgets it by Friday.",
    attribution: "— EcoInteract Design Principle",
    body: "We built this platform on the conviction that ecological literacy is not a subject to pass, but a lens to carry through life. Every design decision — every animation, every interaction — is in service of that single goal.",
  },

  project: {
    sectionLabel: "The Project",
    heading: "Academic Purpose & Learning Philosophy",
    purpose:
      "EcoInteract was developed as an academic computer science project at Tecnia Institute of Advanced Studies (TIAS), submitted to the Department of Computer Science. It demonstrates how modern web technologies — React, animation libraries, and interactive data visualization — can be harnessed to solve a genuine pedagogical challenge in environmental education.",
    approach:
      "The platform adopts a visual-first, interaction-driven approach to teaching two foundational topics: energy flow through ecosystems, and ecological succession. Rather than supplementing a textbook, EcoInteract aims to be the primary learning artifact — a living document that responds, animates, and rewards curiosity.",
    value:
      "Educational value is measured not by content volume but by conceptual clarity. Every section is designed to produce one durable insight. The goal is not to cover ecology — it is to make students feel it.",
    submitted: "Submitted to: Dr. Sushma Bahuguna",
    institution: "Tecnia Institute of Advanced Studies (TIAS)",
  },

  developer: {
    name: "Aman Rawat",
    role: "Developer & Designer",
    institution: "TIAS — Computer Science",
    avatar: "https://api.dicebear.com/7.x/lorelei/svg?seed=AmanRawat&backgroundColor=0f172a",
    bio: "I built EcoInteract because I believe that the gap between knowing and understanding is bridged by experience. As a computer science student who grew up watching nature documentaries, I wanted to build something that made ecological theory feel as dramatic and alive as a David Attenborough episode — but interactive.",
    motivation:
      "The motivation was simple: if I could build a tool that made one student genuinely understand why ecosystems collapse or thrive, the project would be a success.",
  },

  vision: {
    sectionLabel: "Looking Forward",
    heading: "Where EcoInteract Goes Next",
    items: [
      {
        number: "01",
        title: "AI-Powered Ecosystem Simulations",
        description:
          "Generative models that create unique, never-before-seen ecosystems for students to explore and stress-test.",
      },
      {
        number: "02",
        title: "Real-World Data Integration",
        description:
          "Live feeds from environmental sensors and biodiversity databases to connect simulations to the actual planet.",
      },
      {
        number: "03",
        title: "Student Analytics Dashboard",
        description:
          "Track conceptual comprehension over time, identify gaps, and deliver targeted interactive exercises.",
      },
      {
        number: "04",
        title: "Expanded Biome Coverage",
        description:
          "From coral reefs to boreal forests — every major biome modeled, animated, and explorable.",
      },
    ],
  },

  closing: {
    line1: "Ecology is not a subject.",
    line2: "It is the story of everything alive.",
    line3: "And you are part of it.",
    cta: "Begin Exploring",
    ctaLink: "/",
  },
};

export default aboutData;