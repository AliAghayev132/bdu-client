"use client";
import React from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import AdminPageHeader from "../../../(components)/AdminPageHeader";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { ChevronLeft } from "lucide-react";

export default function CreateEntityPage() {
  const { entity } = useParams();
  const search = useSearchParams();
  const pageFromQuery = search?.get("page");
  const backTo = `/admin/dashboard/${pageFromQuery || entity}`;

  const labels = {
    xeberler: { title: "Yeni xəbər" },
    elanlar: { title: "Yeni elan" },
  };
  const ui = labels[entity] || { title: `Yeni ${entity}` };

  return (
    <div className="">
      <AdminPageHeader
        title={ui.title}
        action={
          <Link href={backTo} className="flex items-center gap-2 px-3 py-2 bg-white text-secondary">
            <ChevronLeft size={16} /> Geri
          </Link>
        }
      />
      <div className="admin-wrapper">
        <SimpleEditor />
      </div>
    </div>
  );
}
