import type { ContentSection, Topic } from "@/types/help-types";
import {
  Info,
  Lightbulb,
  Thermometer,
  Dna,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

export function renderTopicContent(topic: Topic) {
  return (
    <div className="space-y-6">
      {topic.sections.map((section, index) => (
        <div key={index}>{renderSection(section)}</div>
      ))}
    </div>
  );
}

function renderSection(section: ContentSection) {
  switch (section.type) {
    case "paragraph":
      return <p className="text-black font-medium">{section.content}</p>;

    case "heading":
      if (section.level === 2) {
        return <h2 className="text-2xl font-bold mb-3">{section.content}</h2>;
      } else if (section.level === 3) {
        return <h3 className="text-xl font-bold mb-3">{section.content}</h3>;
      } else {
        return <h4 className="text-lg font-bold mb-2">{section.content}</h4>;
      }

    case "list":
      if (section.items) {
        return (
          <div className="bg-blue-500/40 p-4 border border-white/80 rounded-lg">
            <h4 className="font-bold text-xl mb-3">{section.content}</h4>
            <ol className="list-decimal pl-5 space-y-2">
              {section.items.map((item, i) => (
                <li className="list-item" key={i}>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        );
      }
      return null;

    case "tip":
      return (
        <div className="bg-yellow-700/40 border border-yellow-400 text-yellow-100/90 p-4 rounded-lg">
          <div className="flex items-center gap-1 mb-2">
            {renderIcon(section.iconType)}
            <div>
              <h4 className="font-bold text-lg">Pro Tip:</h4>
            </div>{" "}
          </div>{" "}
          <p>{section.content}</p>
        </div>
      );

    case "grid":
      return (
        <div className=" rounded-lg">
          <div
            className={`grid grid-cols-1 ${
              section.columns === 2 ? "md:grid-cols-2" : ""
            } gap-4`}
          >
            {section.gridItems?.map((item, i) => (
              <div key={i} className="bg-blue-500/20 p-3 rounded-lg">
                <div className="flex gap-2 items-center">
                  <span className={` ${item.bgColor} rounded-full p-2`}>
                    {item.icon}
                  </span>{" "}
                  <h5 className="font-semibold">{item.title}</h5>
                </div>

                <p className="text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "divider":
      return (
        <div className="bg-blue-700/30 p-4 h-40 flex items-end bg-gradient-to-b from-white/60 to-blue-600/80 rounded-lg">
          <p className="text-center italic">{section.content}</p>
        </div>
      );

    case "center":
      return (
        <div className="bg-transparent p-4 h-40 flex flex-col items-center justify-center  rounded-lg">
          <UtensilsCrossed fill="#fff" className="w-9 h-9" />
          <p className="text-center italic">{section.content}</p>
        </div>
      );

    default:
      return <p>{section.content}</p>;
  }
}

function renderIcon(iconType?: string) {
  switch (iconType) {
    case "info":
      return <Info className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
    case "lightbulb":
      return <Lightbulb className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
    case "thermometer":
      return <Thermometer className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
    case "dna":
      return <Dna className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
    case "sparkles":
      return <Sparkles className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
    default:
      return <Info className="h-6 w-6 mr-2 mt-1 flex-shrink-0" />;
  }
}
