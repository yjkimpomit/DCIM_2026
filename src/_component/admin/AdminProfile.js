"use client";

import { useState } from "react";
import UserInformationForm from "./UserInformationForm";
import { AdminNotice } from "./AdminDialog";
import { sampleProfile } from "@/_lib/admin/sampleData";

export default function AdminProfile() {
  const [profile, setProfile] = useState(sampleProfile);
  const [notice, setNotice] = useState(false);
  return <div className="admin-page-body"><UserInformationForm user={profile} profile onSave={(form) => { setProfile(form); setNotice(true); }} />{notice && <AdminNotice onClose={() => setNotice(false)}>관리자 정보가 저장되었습니다.</AdminNotice>}</div>;
}

