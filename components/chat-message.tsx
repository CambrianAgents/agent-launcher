import { User, Bot } from "lucide-react"

interface ChatMessageProps {
  role: "user" | "assistant" | "system"
  content: string
}

// Helper function to detect URLs and markdown links in text and convert them to JSX with links
const renderTextWithLinks = (text: string) => {
  // First, handle markdown-style links: [text](url)
  const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let processedText = text;
  const result: React.ReactNode[] = [];
  
  // Find all markdown links and collect them
  const markdownLinks: { fullMatch: string; text: string; url: string }[] = [];
  let match;
  while ((match = markdownLinkRegex.exec(text)) !== null) {
    markdownLinks.push({
      fullMatch: match[0],
      text: match[1],
      url: match[2]
    });
  }
  
  // If we found markdown links, process them
  if (markdownLinks.length > 0) {
    let lastIndex = 0;
    
    markdownLinks.forEach(link => {
      // Add text before the markdown link
      const startIndex = text.indexOf(link.fullMatch, lastIndex);
      if (startIndex > lastIndex) {
        // Process regular URLs in text segments between markdown links
        result.push(...processUrlsInText(text.substring(lastIndex, startIndex)));
      }
      
      // Add the markdown link as a clickable link
      result.push(
        <a 
          key={`md-${link.url}`} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline break-all"
        >
          {link.text}
        </a>
      );
      
      lastIndex = startIndex + link.fullMatch.length;
    });
    
    // Add any remaining text after the last markdown link
    if (lastIndex < text.length) {
      result.push(...processUrlsInText(text.substring(lastIndex)));
    }
    
    return result;
  }
  
  // If no markdown links found, just process regular URLs
  return processUrlsInText(text);
};

// Helper function to process regular URLs in text
const processUrlsInText = (text: string) => {
  // Regex to match URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Split the text by URLs
  const parts = text.split(urlRegex);
  
  // Find all URLs in the text
  const urls = text.match(urlRegex) || [];
  
  // Construct the result by interleaving text and link elements
  const result: React.ReactNode[] = [];
  
  parts.forEach((part, i) => {
    // Add the text part
    if (part) result.push(part);
    
    // Add the URL (if any) that follows this part
    if (urls[i]) {
      result.push(
        <a 
          key={`url-${i}`} 
          href={urls[i]} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline break-all"
        >
          {urls[i]}
        </a>
      );
    }
  });
  
  return result;
};

export default function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex max-w-[80%] ${isUser ? "flex-row-reverse" : "flex-row"} items-start gap-2`}>
        <div
          className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isUser ? "bg-gradient-to-br from-[#ccff33] to-[#7dcc00]" : "bg-[#2a2a2a]"}
        `}
        >
          {isUser ? <User className="h-4 w-4 text-[#1c1c1c]" /> : <Bot className="h-4 w-4 text-[#ccff33]" />}
        </div>

        <div
          className={`
          p-3 rounded-2xl
          ${
            isUser
              ? "bg-gradient-to-r from-[#ccff33] to-[#7dcc00] text-[#1c1c1c]"
              : "bg-[#2a2a2a] text-[#fcf7f0] border border-[#333333]"
          }
        `}
        >
          {renderTextWithLinks(content)}
        </div>
      </div>
    </div>
  )
}