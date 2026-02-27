import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing database...");
    await User.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();

    const password = await bcrypt.hash("123456", 10);

    console.log("Creating users...");
    const users = await User.insertMany([
      // 0
      {
        name: "Admin",
        email: "admin@test.com",
        username: "admin",
        password,
        avatar: "/uploads/avatars/avatar_admin.jpg",
        isVerified: true,
        isAdmin: true,
        bio: "Platform administrator.",
      },
      // 1
      {
        name: "Athul Krishna",
        email: "athul@test.com",
        username: "athul",
        password,
        avatar: "/uploads/avatars/avatar1.jpg",
        isVerified: true,
        bio: "Full-stack dev. Coffee addict.",
      },
      // 2
      {
        name: "Rahul Menon",
        email: "rahul@test.com",
        username: "rahul",
        password,
        avatar: "/uploads/avatars/avatar2.jpg",
        isVerified: true,
        bio: "UI/UX designer. Figma fanboy.",
      },
      // 3
      {
        name: "Anjali Nair",
        email: "anjali@test.com",
        username: "anjali",
        password,
        avatar: "/uploads/avatars/avatar3.jpg",
        isVerified: true,
        bio: "Frontend engineer. React enthusiast.",
      },
      // 4
      {
        name: "Arjun Pillai",
        email: "arjun@test.com",
        username: "arjun_p",
        password,
        avatar: "/uploads/avatars/avatar4.jpg",
        isVerified: true,
        bio: "DevOps | Cloud | Open source contributor.",

      },
      // 5
      {
        name: "Sneha Raj",
        email: "sneha@test.com",
        username: "sneha_raj",
        password,
        avatar: "/uploads/avatars/avatar5.jpg",
        isVerified: true,
        bio: "Data scientist. Python all day.",
      },
      // 6
      {
        name: "Vivek Kumar",
        email: "vivek@test.com",
        username: "vivek_k",
        password,
        avatar: "/uploads/avatars/avatar6.jpg",
        isVerified: true,
        bio: "Backend engineer. Node & Go.",
      },
      // 7
      {
        name: "Priya Suresh",
        email: "priya@test.com",
        username: "priya_s",
        password,
        avatar: "/uploads/avatars/avatar7.jpg",
        isVerified: true,
        bio: "Mobile dev. Flutter & React Native.",
      },
      // 8
      {
        name: "Kiran Das",
        email: "kiran@test.com",
        username: "kiran_d",
        password,
        avatar: "/uploads/avatars/avatar8.jpg",
        isVerified: true,
        bio: "Security researcher. Bug bounty hunter.",
      },
      // 9
      {
        name: "Meera Thomas",
        email: "meera@test.com",
        username: "meera_t",
        password,
        avatar: "/uploads/avatars/avatar9.jpg",
        isVerified: true,
        bio: "Product manager. Obsessed with metrics.",
      },
      // 10
      {
        name: "Rohit Sharma",
        email: "rohit@test.com",
        username: "rohit_sh",
        password,
        isVerified: true,
        avatar: "/uploads/avatars/avatar10.jpg",
        bio: "Freelance developer. Building in public.",
      },
      // 11
      {
        name: "Divya Mohan",
        email: "divya@test.com",
        username: "divya_m",
        password,
        avatar: "/uploads/avatars/avatar11.jpg",
        isVerified: true,
        bio: "Graphic designer. Dribbble addict.",
      },
      // 12
      {
        name: "Arun Babu",
        email: "arun@test.com",
        username: "arun_b",
        password,
        avatar: "/uploads/avatars/avatar12.jpg",
        isVerified: true,
        bio: "ML engineer. Currently obsessed with LLMs.",
      },
      // 13
      {
        name: "Lakshmi Pradeep",
        email: "lakshmi@test.com",
        username: "lakshmi_p",
        password,
        isVerified: true,
        avatar: "/uploads/avatars/avatar13.jpg",
        bio: "Content creator. Tech writer.",
      },
      // 14
      {
        name: "Nikhil Varma",
        email: "nikhil@test.com",
        username: "nikhil_v",
        password,
        isVerified: true,
        avatar: "/uploads/avatars/avatar14.jpg",
        bio: "Startup founder. Building SaaS tools.",
      },
      // 15
      {
        name: "Pooja Iyer",
        email: "pooja@test.com",
        username: "pooja_i",
        password,
        avatar: "/uploads/avatars/avatar15.jpg",
        isVerified: true,
        bio: "QA engineer. Breaking things professionally.",
      },
      // 16
      {
        name: "Sanjay Nambiar",
        email: "sanjay@test.com",
        username: "sanjay_n",
        password,
        avatar: "/uploads/avatars/avatar16.jpg",
        isVerified: true,
        bio: "Blockchain dev. Web3 explorer.",
      },
      // 17
      {
        name: "Fathima Banu",
        email: "fathima@test.com",
        username: "fathima_b",
        password,
        avatar: "/uploads/avatars/avatar17.jpg",
        isVerified: true,
        bio: "AI researcher. NLP focus.",
      },
      // 18
      {
        name: "Govind Raj",
        email: "govind@test.com",
        username: "govind_r",
        password,
        avatar: "/uploads/avatars/avatar18.jpg",
        isVerified: true,
        bio: "Open source maintainer. Linux nerd.",
      },
      // 19
      {
        name: "Ananya Krishnan",
        email: "ananya@test.com",
        username: "ananya_k",
        password,
        avatar: "/uploads/avatars/avatar19.jpg",
        isVerified: true,
        bio: "Game developer. Unity & Unreal.",
      },
      // 20
      {
        name: "Sreejith Paul",
        email: "sreejith@test.com",
        username: "sreejith_p",
        password,
        isVerified: true,
        avatar: "/uploads/avatars/avatar20.jpg",
        bio: "IoT engineer. Hardware meets software.",
      },
      // 21
      {
        name: "Haritha Nair",
        email: "haritha@test.com",
        username: "haritha_n",
        password,
        isVerified: true,
        avatar: "/uploads/avatars/avatar21.jpg",
        bio: "Cybersecurity analyst. OSCP certified.",
      },
      // 22
      {
        name: "Jithin Mathew",
        email: "jithin@test.com",
        username: "jithin_m",
        password,
        avatar: "/uploads/avatars/avatar22.jpg",
        isVerified: true,
        bio: "Systems programmer. Rust advocate.",
      },
    ]);

    /* ── FOLLOW RELATIONSHIPS ── */
    // Define pairs: [follower_index, following_index]
    const followPairs = [
      [1, 2], [2, 1],   // Athul ↔ Rahul
      [1, 3], [3, 1],   // Athul ↔ Anjali
      [2, 3], [3, 2],   // Rahul ↔ Anjali
      [4, 1], [1, 4],   // Arjun ↔ Athul
      [5, 2], [2, 5],   // Sneha ↔ Rahul
      [6, 1],           // Vivek → Athul
      [6, 4],           // Vivek → Arjun
      [7, 3],           // Priya → Anjali
      [7, 5],           // Priya → Sneha
      [8, 6], [6, 8],   // Kiran ↔ Vivek
      [9, 2],           // Meera → Rahul
      [9, 14],          // Meera → Nikhil
      [10, 1],          // Rohit → Athul
      [10, 6],          // Rohit → Vivek
      [11, 7], [7, 11], // Divya ↔ Priya
      [12, 5], [5, 12], // Arun ↔ Sneha
      [12, 17],         // Arun → Fathima
      [13, 9],          // Lakshmi → Meera
      [13, 14],         // Lakshmi → Nikhil
      [14, 1],          // Nikhil → Athul
      [14, 10],         // Nikhil → Rohit
      [15, 8],          // Pooja → Kiran
      [16, 12],         // Sanjay → Arun
      [16, 18],         // Sanjay → Govind
      [17, 5],          // Fathima → Sneha
      [17, 12],         // Fathima → Arun
      [18, 4],          // Govind → Arjun
      [18, 22],         // Govind → Jithin
      [19, 11],         // Ananya → Divya
      [19, 7],          // Ananya → Priya
      [20, 18],         // Sreejith → Govind
      [21, 8], [8, 21], // Haritha ↔ Kiran
      [22, 18], [18, 22],// Jithin ↔ Govind
      [0, 1], [0, 2], [0, 3], // Admin follows first few
    ];

    for (const [followerIdx, followingIdx] of followPairs) {
      if (!users[followerIdx].following.includes(users[followingIdx]._id)) {
        users[followerIdx].following.push(users[followingIdx]._id);
      }
      if (!users[followingIdx].followers.includes(users[followerIdx]._id)) {
        users[followingIdx].followers.push(users[followerIdx]._id);
      }
    }

    await Promise.all(users.map((u) => u.save()));

    /* ── POSTS ── */
    console.log("Creating posts...");
    const posts = await Post.insertMany([
      // Athul [1]
      {
        user: users[1]._id,
        content: "Just shipped the explore feature on our MERN social app. Feels great!",
        images: ["/uploads/posts/post1.jpg"],
        likes: [users[2]._id, users[3]._id, users[4]._id],
      },
      {
        user: users[1]._id,
        content: "Node.js tip: always handle unhandled promise rejections with process.on('unhandledRejection').",
        likes: [users[6]._id, users[10]._id],
      },
      // Rahul [2]
      {
        user: users[2]._id,
        content: "Dark mode vs light mode — still the most divisive debate in tech.",
        images: ["/uploads/posts/post2.jpg"],
        likes: [users[1]._id, users[11]._id, users[3]._id],
      },
      {
        user: users[2]._id,
        content: "Redesigned our onboarding flow. Drop rate reduced by 30%.",
        likes: [users[9]._id, users[13]._id],
      },
      // Anjali [3]
      {
        user: users[3]._id,
        content: "useCallback and useMemo are not free. Profile before you optimise.",
        likes: [users[1]._id, users[7]._id],
      },
      {
        user: users[3]._id,
        content: "First open source contribution merged today!",
        images: ["/uploads/posts/post3.jpg"],
        likes: [users[2]._id, users[4]._id, users[18]._id],
      },
      // Arjun [4]
      {
        user: users[4]._id,
        content: "Kubernetes vs Docker Swarm in 2024 — k8s wins for anything beyond a single host.",
        likes: [users[6]._id, users[8]._id, users[20]._id],
      },
      // Sneha [5]
      {
        user: users[5]._id,
        content: "Pandas 2.0 with PyArrow backend is genuinely fast. No more dtype warnings.",
        likes: [users[12]._id, users[17]._id],
      },
      {
        user: users[5]._id,
        content: "Finished reading 'Designing Machine Learning Systems'. Highly recommend.",
        images: ["/uploads/posts/post4.jpg"],
        likes: [users[12]._id, users[9]._id],
      },
      // Vivek [6]
      {
        user: users[6]._id,
        content: "Go routines are beautiful until you hit a race condition at 2am.",
        likes: [users[22]._id, users[1]._id, users[4]._id],
      },
      // Priya [7]
      {
        user: users[7]._id,
        content: "Flutter 3.x hot reload is still the best DX in mobile dev.",
        likes: [users[3]._id, users[19]._id],
      },
      // Kiran [8]
      {
        user: users[8]._id,
        content: "Found a stored XSS on a major platform. Responsibly disclosed. Bounty received.",
        likes: [users[21]._id, users[15]._id, users[4]._id],
      },
      // Meera [9]
      {
        user: users[9]._id,
        content: "Retention > acquisition. Every time.",
        likes: [users[13]._id, users[14]._id],
      },
      // Rohit [10]
      {
        user: users[10]._id,
        content: "30 days of building in public. Here's what I learned: ship ugly, iterate fast.",
        images: ["/uploads/posts/post5.jpg"],
        likes: [users[14]._id, users[1]._id, users[9]._id],
      },
      // Divya [11]
      {
        user: users[11]._id,
        content: "Typography is 95% of design. Stop ignoring font pairing.",
        images: ["/uploads/posts/post6.jpg"],
        likes: [users[2]._id, users[7]._id, users[3]._id],
      },
      // Arun [12]
      {
        user: users[12]._id,
        content: "Fine-tuned a small LLM on domain-specific data. 8B params, runs on a single A100.",
        likes: [users[5]._id, users[17]._id, users[6]._id],
      },
      // Lakshmi [13]
      {
        user: users[13]._id,
        content: "Writing is thinking. If you can't explain it simply, you don't understand it.",
        likes: [users[9]._id, users[2]._id],
      },
      // Nikhil [14]
      {
        user: users[14]._id,
        content: "Launched our SaaS MVP. First paying customer within 48 hours.",
        images: ["/uploads/posts/post7.jpg"],
        likes: [users[10]._id, users[1]._id, users[13]._id, users[9]._id],
      },
      // Pooja [15]
      {
        user: users[15]._id,
        content: "QA tip: write tests for the bugs that already exist, not just the happy path.",
        likes: [users[8]._id, users[1]._id],
      },
      // Sanjay [16]
      {
        user: users[16]._id,
        content: "Smart contracts are immutable. That's the feature. That's also the bug.",
        likes: [users[12]._id, users[6]._id],
      },
      // Fathima [17]
      {
        user: users[17]._id,
        content: "Transformer attention is O(n²). That's why context windows still matter.",
        likes: [users[5]._id, users[12]._id, users[6]._id],
      },
      // Govind [18]
      {
        user: users[18]._id,
        content: "Switched my entire workflow to Neovim. Not looking back.",
        likes: [users[22]._id, users[4]._id],
      },
      // Ananya [19]
      {
        user: users[19]._id,
        content: "Unreal Engine 5 Nanite makes LOD management mostly irrelevant. Wild times.",
        likes: [users[7]._id, users[11]._id],
      },
      // Sreejith [20]
      {
        user: users[20]._id,
        content: "MQTT over WebSockets for real-time IoT dashboards — leaner than you'd think.",
        likes: [users[4]._id, users[6]._id, users[18]._id],
      },
      // Haritha [21]
      {
        user: users[21]._id,
        content: "Passed OSCP on first attempt. The labs are brutal. Do all of them.",
        likes: [users[8]._id, users[15]._id, users[4]._id],
      },
      // Jithin [22]
      {
        user: users[22]._id,
        content: "Rust ownership model clicks after you stop fighting it and start thinking in lifetimes.",
        likes: [users[6]._id, users[18]._id, users[4]._id],
      },
    ]);

    /* ── COMMENTS ── */
    console.log("Creating comments...");
    await Comment.insertMany([
      // Post 0 — Athul's explore feature post
      { post: posts[0]._id, user: users[2]._id, text: "UI looks clean. Nice work!" },
      { post: posts[0]._id, user: users[3]._id, text: "How did you handle the search indexing?" },
      { post: posts[0]._id, user: users[4]._id, text: "Congrats on shipping!" },

      // Post 1 — Athul's Node tip
      { post: posts[1]._id, user: users[6]._id, text: "Also throw on uncaughtException or the process is in unknown state." },
      { post: posts[1]._id, user: users[10]._id, text: "Good call. Got bitten by this once." },

      // Post 2 — Rahul's dark mode post
      { post: posts[2]._id, user: users[1]._id, text: "Dark mode. No contest." },
      { post: posts[2]._id, user: users[3]._id, text: "System default and call it a day." },
      { post: posts[2]._id, user: users[11]._id, text: "Light mode for design work. Dark for coding." },

      // Post 3 — Rahul's onboarding redesign
      { post: posts[3]._id, user: users[9]._id, text: "30% drop reduction is significant. What was the main friction point?" },
      { post: posts[3]._id, user: users[13]._id, text: "Would love a writeup on this." },

      // Post 5 — Anjali's open source
      { post: posts[5]._id, user: users[1]._id, text: "First of many!" },
      { post: posts[5]._id, user: users[18]._id, text: "Which project?" },

      // Post 6 — Arjun's k8s post
      { post: posts[6]._id, user: users[4]._id, text: "Swarm is fine for small teams with simple needs though." },
      { post: posts[6]._id, user: users[20]._id, text: "k3s is a nice middle ground." },

      // Post 9 — Vivek's Go post
      { post: posts[9]._id, user: users[1]._id, text: "Race detector helps. Run tests with -race." },
      { post: posts[9]._id, user: users[22]._id, text: "Rust would not let that compile." },

      // Post 13 — Rohit's build in public
      { post: posts[13]._id, user: users[14]._id, text: "Solid advice. Momentum > perfection." },
      { post: posts[13]._id, user: users[9]._id, text: "What's the product?" },

      // Post 17 — Nikhil's SaaS launch
      { post: posts[17]._id, user: users[10]._id, text: "What's the stack?" },
      { post: posts[17]._id, user: users[1]._id, text: "First customer is the hardest. Congrats!" },
      { post: posts[17]._id, user: users[13]._id, text: "Share the link!" },

      // Post 20 — Fathima's transformer post
      { post: posts[20]._id, user: users[12]._id, text: "Flash attention reduces that to O(n). Worth looking into." },
      { post: posts[20]._id, user: users[5]._id, text: "This is why sparse attention matters at scale." },

      // Post 24 — Haritha's OSCP
      { post: posts[24]._id, user: users[8]._id, text: "Well deserved. The buffer overflow sections alone are a workout." },
      { post: posts[24]._id, user: users[15]._id, text: "Inspiring. On my list for next year." },

      // Post 25 — Jithin's Rust post
      { post: posts[25]._id, user: users[18]._id, text: "Took me two months. Now I evangelize it to everyone." },
      { post: posts[25]._id, user: users[6]._id, text: "Still prefer Go for services but Rust for anything perf-critical." },
    ]);

    console.log("Seed completed successfully — 23 users, 26 posts, 26 comments.");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();