"use client";

import { useState, useEffect } from "react";
import { SiteContent, defaultContent } from "@/lib/siteContentStore";

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch('/api/site-content')
      .then(res => res.json())
      .then(data => {
        if (data.content) {
          setContent(data.content);
        }
      })
      .catch(console.error);
  }, []);

  return content;
}