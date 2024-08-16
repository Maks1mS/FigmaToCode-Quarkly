import { convertIntoNodes } from "./altNodes/altConversion";
import {
  retrieveGenericSolidUIColors,
  retrieveGenericLinearGradients as retrieveGenericGradients,
} from "./common/retrieveUI/retrieveColors";
import { htmlMain } from "./html/htmlMain";
import { quarklyMain } from "./quarkly/quarklyMain";
export type FrameworkTypes = "Flutter" | "SwiftUI" | "HTML" | "Tailwind" | "Quarkly";

export type PluginSettings = {
  framework: FrameworkTypes;
  jsx: boolean;
  inlineStyle: boolean;
  optimizeLayout: boolean;
  layerName: boolean;
  responsiveRoot: boolean;
  flutterGenerationMode: string;
  swiftUIGenerationMode: string;
  roundTailwindValues: boolean;
  roundTailwindColors: boolean,
  customTailwindColors: boolean,
};

export const run = (settings: PluginSettings) => {
  // ignore when nothing was selected
  if (figma.currentPage.selection.length === 0) {
    figma.ui.postMessage({
      type: "empty",
    });
    return;
  }

  const convertedSelection = convertIntoNodes(
    figma.currentPage.selection,
    null
  );
  const result = quarklyMain(convertedSelection, settings);

  figma.ui.postMessage({
    type: "code",
    data: result,
    settings: settings,
    htmlPreview:
      convertedSelection.length > 0
        ? {
            size: convertedSelection.map((node) => ({
              width: node.width,
              height: node.height,
            }))[0],
            content: htmlMain(
              convertedSelection,
              {
                ...settings,
                jsx: false,
              },
              true
            ),
          }
        : null,
    colors: retrieveGenericSolidUIColors(settings.framework),
    gradients: retrieveGenericGradients(settings.framework),
    preferences: settings,
    // text: retrieveTailwindText(convertedSelection),
  });
};
