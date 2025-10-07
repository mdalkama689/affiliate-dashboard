import React, { useState, useEffect } from "react";

import { motion } from "framer-motion";

import {
  Link,
  Zap,
  Loader2,
  Copy,
  Share2,
  Twitter,
  Facebook,
  Instagram,
  MessageSquare,
  Mail,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const QuickUrlGenerator = ({ projects, bitlyApiKey }) => {
  const [baseUrl, setBaseUrl] = useState("");

  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [generatedUrl, setGeneratedUrl] = useState("");

  const [shortenedUrl, setShortenedUrl] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (projects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(projects[0].id);
    }
  }, [projects, selectedProjectId]);

  const handleUrlPaste = async (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    if (pastedText) {
      setBaseUrl(pastedText);

      if (selectedProjectId) {
        generateUrl(pastedText, selectedProjectId);
      }
    }
  };

  const shortenWithBitly = async (longUrl) => {
    if (!bitlyApiKey) {
      toast.error("❌ Bitly Error", {
        description: "Bitly API key is not configured in settings."
      })
     

      return null;
    }

    try {
      const response = await fetch("https://api-ssl.bitly.com/v4/shorten", {
        method: "POST",

        headers: {
          Authorization: `Bearer ${bitlyApiKey}`,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ long_url: longUrl }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.description || "Failed to shorten URL");

      return data.link;
    } catch (error) {
      toast.error("❌ Bitly Error", {
        description: error.message
      })
     

      return null;
    }
  };

  const shortenWithCustomDomain = (longUrl, project) => {
    const hash = btoa(longUrl).substring(0, 6);

    toast.info("🚧 Custom Domain", {
      description: "This is a mock short URL."
    })

    return `https://${project.customDomain}/${hash}`;
  };

  const generateUrl = async (urlToProcess, projectId) => {
    if (!urlToProcess.trim() || !projectId) {
      return;
    }

    setIsGenerating(true);

    setGeneratedUrl("");

    setShortenedUrl("");

    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      setIsGenerating(false);

      return;
    }

    try {
      const url = new URL(urlToProcess);

      const params = new URLSearchParams(url.search);

      const allParams = {
        utm_source: project.utmSource,

        utm_medium: project.utmMedium,

        utm_campaign: project.utmCampaign,

        utm_term: project.utmTerm,

        utm_content: project.utmContent,

        ...(project.customParams || []).reduce((acc, p) => {
          if (p.key) acc[p.key] = p.value;

          return acc;
        }, {}),
      };

      Object.entries(allParams).forEach(([key, value]) => {
        if (key && value) params.set(key, value);
      });

      url.search = params.toString();

      const longUrl = url.toString();

      setGeneratedUrl(longUrl);

      if (project.shortener && project.shortener !== "none") {
        let shortUrl = null;

        if (project.shortener === "bitly") {
          shortUrl = await shortenWithBitly(longUrl);
        } else if (project.shortener === "custom") {
          shortUrl = shortenWithCustomDomain(longUrl, project);
        }

        if (shortUrl) setShortenedUrl(shortUrl);
      }

      toast.success("⚡ Quick URL Generated!", {
        description: "Your affiliate link is ready."
      })

      
    } catch (error) {

      toast.error("❌ Invalid URL", {
        description: "Pasted text is not a valid URL."
      })
     
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text) => {
    if (!text) return;

    await navigator.clipboard.writeText(text);
toast.success("📋 Copied!", {
  description: "URL has been copied to your clipboard."
})

  
  };

  const getShareUrl = (platform, url, text) => {
    const encodedUrl = encodeURIComponent(url);

    const encodedText = encodeURIComponent(text);

    switch (platform) {
      case "twitter":
        return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;

      case "facebook":
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

      case "whatsapp":
        return `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;

      case "telegram":
        return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;

      case "email":
        return `mailto:?subject=${encodedText}&body=${encodedUrl}`;

      default:
        return "#";
    }
  };

  const finalUrl = shortenedUrl || generatedUrl;

  const shareText = `Check this out!`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 mb-8"
    >
      <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-4">
        <Zap className="w-7 h-7 text-yellow-400" />
        Quick URL Generator || 
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <Label htmlFor="quickUrl" className="text-white mb-2 block">
            Paste URL to Convert
          </Label>

          <Input
            id="quickUrl"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            onPaste={handleUrlPaste}
            placeholder="Paste a link here and we'll do the magic ✨"
            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-purple-400"
          />
        </div>

        <div>
          <Label htmlFor="quickProject" className="text-white mb-2 block">
            Select Brand
          </Label>

          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger
              id="quickProject"
              className="w-full bg-white/10 border-white/20 text-white"
            >
              <SelectValue placeholder="Select a brand..." />
            </SelectTrigger>

            <SelectContent>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={() => generateUrl(baseUrl, selectedProjectId)}
        disabled={isGenerating || !baseUrl || !selectedProjectId}
        className="w-full mt-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
          </>
        ) : (
          "Generate Affiliate Link"
        )}
      </Button>

      {finalUrl && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <div className="bg-white/5 rounded-xl p-4 border border-green-500/30">
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/10 rounded-lg p-3 border border-white/20">
                <p className="text-white text-sm break-all font-bold">
                  {finalUrl}
                </p>
              </div>

              <Button
                onClick={() => copyToClipboard(finalUrl)}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
              >
                <Copy className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
              <p className="text-sm text-gray-300 flex items-center gap-2">
                <Share2 className="w-4 h-4" /> Share via:
              </p>

              <div className="flex gap-2">
                <a
                  href={getShareUrl("twitter", finalUrl, shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#1DA1F2]"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href={getShareUrl("facebook", finalUrl, shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#1877F2]"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href={getShareUrl("whatsapp", finalUrl, shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#25D366]"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </Button>
                </a>

                <a
                  href={getShareUrl("telegram", finalUrl, shareText)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-[#0088cc]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m22 2-7 20-4-9-9-4Z" />
                      <path d="M22 2 11 13" />
                    </svg>
                  </Button>
                </a>

                <a
                  href={getShareUrl("email", finalUrl, shareText)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                  >
                    <Mail className="w-5 h-5" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuickUrlGenerator;
