import { useEffect } from "react";

type SeoProps = {
  title: string;
  description?: string;
};

const BASE_TITLE = "Brainwave Science & Maths";

export function useSeo({ title, description }: SeoProps) {
  useEffect(() => {
    document.title = title.includes(BASE_TITLE) ? title : `${title} | ${BASE_TITLE}`;
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [title, description]);
}
