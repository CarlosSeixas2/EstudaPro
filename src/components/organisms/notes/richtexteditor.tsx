import type React from "react";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Type,
  Palette,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const fontSizes = [
  { label: "Pequeno", value: "14px" },
  { label: "Normal", value: "16px" },
  { label: "Médio", value: "18px" },
  { label: "Grande", value: "24px" },
  { label: "Muito Grande", value: "32px" },
];

const textColors = [
  { label: "Preto", value: "#000000" },
  { label: "Cinza", value: "#6B7280" },
  { label: "Vermelho", value: "#EF4444" },
  { label: "Laranja", value: "#F97316" },
  { label: "Amarelo", value: "#EAB308" },
  { label: "Verde", value: "#22C55E" },
  { label: "Azul", value: "#3B82F6" },
  { label: "Roxo", value: "#8B5CF6" },
  { label: "Rosa", value: "#EC4899" },
];

const highlightColors = [
  { label: "Sem destaque", value: "transparent" },
  { label: "Amarelo", value: "#FEF3C7" },
  { label: "Verde", value: "#D1FAE5" },
  { label: "Azul", value: "#DBEAFE" },
  { label: "Roxo", value: "#E9D5FF" },
  { label: "Rosa", value: "#FCE7F3" },
  { label: "Vermelho", value: "#FEE2E2" },
];

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Comece a escrever...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && content !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleFontSize = (size: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const span = document.createElement("span");
        span.style.fontSize = size;
        try {
          range.surroundContents(span);
        } catch {
          const contents = range.extractContents();
          span.appendChild(contents);
          range.insertNode(span);
        }
        selection.removeAllRanges();
        handleInput();
      }
    }
    editorRef.current?.focus();
  };

  const handleTextColor = (color: string) => {
    execCommand("foreColor", color);
  };

  const handleHighlight = (color: string) => {
    execCommand("backColor", color);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.src = e.target?.result as string;
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        img.style.margin = "10px 0";
        img.style.borderRadius = "8px";

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.insertNode(img);
          range.collapse(false);
        } else if (editorRef.current) {
          editorRef.current.appendChild(img);
        }

        handleInput();
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <div className="border-b p-2 flex items-center gap-1 flex-wrap bg-muted/30">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Type className="h-4 w-4 mr-1" />
              Tamanho
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-2">
            <div className="space-y-1">
              {fontSizes.map((size) => (
                <Button
                  key={size.value}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start h-8"
                  onClick={() => handleFontSize(size.value)}
                >
                  <span style={{ fontSize: size.value }}>{size.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("bold")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("italic")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("underline")}
        >
          <Underline className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8">
              <Palette className="h-4 w-4 mr-1" />
              Cor
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <div className="space-y-2">
              <div>
                <p className="text-xs font-medium mb-2">Cor do texto</p>
                <div className="grid grid-cols-3 gap-1">
                  {textColors.map((color) => (
                    <button
                      key={color.value}
                      className="w-8 h-8 rounded border-2 border-border hover:border-primary"
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleTextColor(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Destaque</p>
                <div className="grid grid-cols-3 gap-1">
                  {highlightColors.map((color) => (
                    <button
                      key={color.value}
                      className="w-8 h-8 rounded border-2 border-border hover:border-primary"
                      style={{ backgroundColor: color.value }}
                      onClick={() => handleHighlight(color.value)}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyLeft")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyCenter")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("justifyRight")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertUnorderedList")}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => execCommand("insertOrderedList")}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Image Upload */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={() => fileInputRef.current?.click()}
        >
          <ImageIcon className="h-4 w-4 mr-1" />
          Imagem
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[400px] p-6 focus:outline-none prose prose-sm max-w-none"
        style={{
          lineHeight: "1.8",
          fontSize: "16px",
        }}
        onInput={handleInput}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
