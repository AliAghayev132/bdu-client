import React from "react";

const BlogContent = ({ html }) => {
  if (!html) return null;
  return (
    <article className="prose prose-lg max-w-none">
      <div className="bg-white prose prose-lg max-w-none md:text-base sm:text-sm text-xs" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
};

export default BlogContent;
  