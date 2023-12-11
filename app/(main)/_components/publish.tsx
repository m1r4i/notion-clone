"use client";

import { Doc } from "@/convex/_generated/dataModel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useOrigin } from "@/hooks/use-origin";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Copy, Globe } from "lucide-react";

interface PublishProps {
  initialData: Doc<"documents">;
}

export const Publish = ({ initialData }: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const url = `${origin}/preview/${initialData._id}`;

  const onPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: true,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "ノートを公開しています...",
      success: "ノートを公開しました!",
      error: "ノートの公開に失敗しました",
    });
  };

  const onUnPublish = () => {
    setIsSubmitting(true);

    const promise = update({
      id: initialData._id,
      isPublished: false,
    }).finally(() => setIsSubmitting(false));

    toast.promise(promise, {
      loading: "ノートを非公開にしています...",
      success: "ノートを非公開にしました!",
      error: "ノートの非公開に失敗しました",
    });
  };

  const onCopy = () => {
    navigator.clipboard.writeText(url);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          {initialData.isPublished ? (
            <Globe className="text-sky-500 w-4 h-4 mr-1" />
          ) : (
            <Globe className="text-muted-foreground w-4 h-4 mr-1" />
          )}
          公開設定
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="end" alignOffset={8} forceMount>
        {initialData.isPublished ? (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-sky-500 mb-2" />
            <p className="text-sm font-medium mb-2">公開</p>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate mb-6"
                value={url}
                disabled
              />
              <Button
                onClick={onCopy}
                disabled={copied}
                className="mb-6 rounded-l-none"
                size="sm"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <span className="text-xs text-muted-foreground mb-4">
              ノートを共有する必要がなくなりましたか?
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onUnPublish}
              className="w-full text-xs"
              size="sm"
            >
              非公開にする
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-2">非公開</p>
            <span className="text-xs text-muted-foreground mb-4">
              ノートを他の人と共有しよう!
            </span>
            <Button
              disabled={isSubmitting}
              onClick={onPublish}
              className="w-full text-xs"
              size="sm"
            >
              公開する
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
