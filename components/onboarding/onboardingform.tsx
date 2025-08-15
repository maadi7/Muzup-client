"use client";

import React, { useState, useEffect } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import {
  MoveLeft,
  User,
  Mail,
  Camera,
  UserCircle,
  AtSign,
  MoveRight,
  Edit2,
  Loader2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DatePicker } from "@/components/ui/date-picker";
import { getYear } from "date-fns";
import Loader from "../Loader";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import { toast } from "react-toastify";
import { sdk } from "@/utils/graphqlClient";

const OnboardingForm = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<string>("");
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update email and profile picture when session loads

  useEffect(() => {
    const check = async () => {
      try {
        setLoading(true);
        const res = await sdk.checkById({
          id: session?.providerAccountId ?? "",
        });
        if (res.checkById) {
          router.push("/home");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.providerAccountId) {
      check();
    }
  }, [session]);

  useEffect(() => {
    if (session?.user) {
      setEmail(session.user.email || "");
      setProfilePicPreview(session.user.image || null);
    }
  }, [session]);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfilePic(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName || firstName.length < 3)
      newErrors.firstName = "First name must be at least 3 characters";
    if (!lastName || lastName.length < 3)
      newErrors.lastName = "Last name must be at least 3 characters";
    if (!username || username.length < 3)
      newErrors.username = "Username must be at least 3 characters";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Please enter a valid email";
    if (!dob) newErrors.dob = "Date of birth is required";
    if (!profilePic && !profilePicPreview)
      newErrors.profilePic = "Profile picture is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log("ff");
    let responseLink: string | null = null;
    try {
      if (profilePic) {
        const res = await uploadToCloudinary(
          profilePic,
          "muzup/profiles",
          session?.user.id ?? new Date().toISOString(),
          "image"
        );
        if (res.error) {
          console.log(res.error);
          toast.error("Some error occured!");
          return;
        }
        if (res.url) {
          responseLink = res.url;
        }
      }
    } catch (error) {
      console.log(error);
    }

    try {
      if (
        session &&
        session.user.email &&
        session.accessToken &&
        session.refreshToken &&
        session.providerAccountId
      ) {
        const res = await sdk.userSingIn({
          input: {
            dob: dob,
            firstName: firstName,
            lastName: lastName,
            username: username,
            InstaId: session?.providerAccountId,
            isArtist: false,
            profilePic: responseLink ?? profilePicPreview,
            aToken: session?.accessToken,
            email: session?.user.email,
            rToken: session?.refreshToken,
            spotyifyId: session?.providerAccountId,
          },
        });
        if (res.userSingIn) {
          toast.success("Profile created sucessfuly!");
          router.push("/home");
        }
      } else {
        toast.error("Something went wrong! please try again later!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Show loading state while session is loading
  if (status === "loading" || loading) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    router.push("/api/auth/signin");
    return null;
  }

  return (
    <div className="text-textColor w-full min-h-screen flex justify-center items-center bg-background px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl w-full p-6 md:p-8 rounded-2xl backdrop-blur-2xl bg-white/10 shadow-xl border border-white/20 space-y-8"
      >
        {/* Go Back */}
        <div className="flex items-center justify-between">
          <Button
            onClick={() => router.push("/")}
            Icon={MoveLeft}
            IconColor="subTextColor"
            text="Go Back"
            IconLeft={true}
            h="5"
            w="4"
          />
        </div>

        {/* Profile Picture */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <img
              src={
                profilePicPreview ||
                "https://via.placeholder.com/150?text=Profile"
              }
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-white"
            />
            <label
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer shadow-md"
            >
              <Edit2 size={18} className="text-black" />
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          </div>
          {errors.profilePic && (
            <p className="text-red-500 text-sm">{errors.profilePic}</p>
          )}
        </div>

        {/* First & Last Name */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
              <User size={18} />
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm">{errors.firstName}</p>
            )}
          </div>

          <div className="w-full">
            <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
              <UserCircle size={18} />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Username & DOB */}
        <div className="flex flex-col md:flex-row gap-5">
          <div className="w-full">
            <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
              <AtSign size={18} />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-transparent outline-none w-full"
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username}</p>
            )}
          </div>

          <div className="w-full">
            <DatePicker
              selectedDate={dob.length === 0 ? null : new Date(dob)}
              setDateFn={(date) => setDob(date.toISOString())}
              endYear={getYear(new Date()) - 18}
            />
            {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
          </div>
        </div>

        {/* Email */}
        <div className="w-full">
          <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent outline-none w-full"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="submit">
            <Button text="Submit" primary Icon={MoveRight} h="4" w="5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default OnboardingForm;
