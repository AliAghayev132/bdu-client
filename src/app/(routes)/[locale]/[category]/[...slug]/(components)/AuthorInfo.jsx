import React from "react";

const AuthorInfo = ({ author, updatedAt, locale }) => {
  if (!author) return null;
  return (
    <div className="mt-12 pt-6 border-t border-gray-200">
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          <span className="font-medium">{author.name[locale]}</span>
          {" • "}
          <span>{author.role[locale]}</span>
        </div>
        <div>
          {locale === "az" ? "Yenilənib" : "Updated"}: {new Date(updatedAt).toLocaleDateString(locale === "az" ? "az-AZ" : "en-US")}
        </div>
      </div>
    </div>
  );
};

export default AuthorInfo;
