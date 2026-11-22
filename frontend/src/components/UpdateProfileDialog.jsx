import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2, FileText } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

export default function UpdateProfileDialog({ open, setOpen }) {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    file: null,
  });
  useEffect(() => {
    if (open)
      setInput({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: String(user?.phoneNumber || ""),
        bio: user?.profile?.bio || "",
        skills: (user?.profile?.skills || []).join(", "),
        file: null,
      });
  }, [open, user]);
  const change = (e) =>
    setInput((previous) => ({ ...previous, [e.target.name]: e.target.value }));
  function chooseFile(e) {
    const file = e.target.files?.[0] || null;
    if (
      file &&
      (file.size > 5 * 1024 * 1024 || !file.name.toLowerCase().endsWith(".pdf"))
    ) {
      toast.error("Choose a PDF resume smaller than 5 MB.");
      e.target.value = "";
      return;
    }
    setInput((previous) => ({ ...previous, file }));
  }
  async function submit(e) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const data = new FormData();
    for (const key of ["fullname", "email", "phoneNumber", "bio", "skills"])
      data.append(key, input[key]);
    if (input.file) data.append("file", input.file);
    try {
      const response = await axios.post(
        USER_API_END_POINT + "/profile/update",
        data,
        { withCredentials: true },
      );
      if (response.data.success) {
        dispatch(setUser(response.data.user));
        toast.success("Your profile has been updated.");
        setOpen(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to save your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!loading) setOpen(value);
      }}
    >
      <DialogContent className="profile-editor">
        <DialogHeader>
          <span className="eyebrow">TELL YOUR STORY</span>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Keep your details up to date and let your strengths shine.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <fieldset disabled={loading} className="profile-editor-fields">
            <div>
              <label htmlFor="profile-fullname">Full name</label>
              <Input
                id="profile-fullname"
                name="fullname"
                required
                value={input.fullname}
                onChange={change}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="profile-email">Email address</label>
              <Input
                id="profile-email"
                name="email"
                type="email"
                required
                value={input.email}
                onChange={change}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="profile-phone">Phone number</label>
              <Input
                id="profile-phone"
                name="phoneNumber"
                type="tel"
                required
                value={input.phoneNumber}
                onChange={change}
                autoComplete="tel"
              />
            </div>
            <div className="editor-full">
              <label htmlFor="profile-bio">About you</label>
              <textarea
                id="profile-bio"
                name="bio"
                rows={4}
                value={input.bio}
                onChange={change}
                placeholder="Your experience, interests, and what you want to do next."
              />
            </div>
            <div className="editor-full">
              <label htmlFor="profile-skills">Skills</label>
              <Input
                id="profile-skills"
                name="skills"
                value={input.skills}
                onChange={change}
                placeholder="React, Design, Project management"
                aria-describedby="skills-help"
              />
              <p id="skills-help">Separate each skill with a comma.</p>
            </div>
            <div className="editor-full editor-file">
              <label htmlFor="profile-resume">
                <FileText size={17} />
                Resume
              </label>
              <Input
                id="profile-resume"
                type="file"
                accept=".pdf,application/pdf"
                onChange={chooseFile}
              />
              <p>PDF, up to 5 MB. Leave empty to keep your current resume.</p>
            </div>
          </fieldset>
          <DialogFooter className="profile-editor-footer">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
