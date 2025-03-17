"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User as UserIcon } from "lucide-react";
import { ProfileSectionProps } from "./types";
import ProfileEditModal from "./ProfileEditModal";

export default function ProfileSection({
  user,
  isCollapsed,
}: ProfileSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div
      className={`${isCollapsed ? "py-6 px-2" : "p-6"} border-b border-slate-600 flex flex-col items-center`}
    >
      <div className="relative">
        {/* Avatar with white border */}
        <div
          className={`${isCollapsed ? "h-12 w-12" : "h-24 w-24"} rounded-full overflow-hidden bg-slate-600 mb-3 transition-all duration-300 border-2 border-white relative mt-5`}
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.displayName || "User"}
              width={isCollapsed ? 48 : 96}
              height={isCollapsed ? 48 : 96}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-slate-600">
              <UserIcon
                size={isCollapsed ? 24 : 48}
                className="text-slate-300"
              />
            </div>
          )}
        </div>
        {/* Pencil icon positioned at the bottom-right of the avatar */}
        <div
          onClick={openModal}
          className="absolute right-0 bottom-0 bg-teal-500 rounded-full w-8 h-8 flex items-center justify-center shadow-md border-2 border-white cursor-pointer hover:bg-teal-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isCollapsed ? 14 : 18}
            height={isCollapsed ? 14 : 18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <h2 className="text-xl font-semibold mt-2">
            {user.displayName || "Customer1"}
          </h2>

          <div className="flex gap-3 mt-4 w-full">
            <Link href="/customer/profile" className="block w-1/2">
              <button className="w-full py-3 px-3 bg-teal-500 rounded text-center font-medium hover:bg-teal-400 transition">
                View
              </button>
            </Link>
            <Link href="/customer/profile/edit" className="block w-1/2">
              <button className="w-full py-3 px-3 bg-slate-600 rounded text-center font-medium hover:bg-slate-500 transition">
                Edit
              </button>
            </Link>
          </div>
        </>
      )}

      {/* Profile Edit Modal */}
      <ProfileEditModal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Edit Profile Picture
          </h2>
          <div className="mb-6 mx-auto w-32 h-32 relative">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.displayName || "User"}
                width={128}
                height={128}
                className="rounded-full w-full h-full object-cover border-4 border-teal-500"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-slate-600 rounded-full border-4 border-teal-500">
                <UserIcon size={64} className="text-slate-300" />
              </div>
            )}
          </div>

          <div className="mb-6">
            <label className="w-full py-3 px-3 bg-teal-500 text-white rounded text-center font-medium hover:bg-teal-400 transition cursor-pointer block">
              Upload New Image
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>

          <div className="flex gap-3">
            <button
              onClick={closeModal}
              className="w-1/2 py-3 px-3 bg-slate-200 rounded text-slate-800 text-center font-medium hover:bg-slate-300 transition"
            >
              Cancel
            </button>
            <button className="w-1/2 py-3 px-3 bg-teal-500 rounded text-white text-center font-medium hover:bg-teal-400 transition">
              Save
            </button>
          </div>
        </div>
      </ProfileEditModal>
    </div>
  );
}
