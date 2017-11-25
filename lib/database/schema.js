var weblog = {
  posts: {
    url: { type: "string" },
    published: { type: "string" },
    updated: { type: "string" },
    title: { type: "string" },
    content: { type: "string" },
    keywords: {
      type: "array",
      items: { type: "string" }
    }
  },
  users: {
    email: { type: "string" },
    name: { type: "string" },
    password: { type: "string" },
    role: { type: "string" }
  }
}