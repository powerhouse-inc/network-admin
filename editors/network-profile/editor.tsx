import type { EditorProps } from "document-model";
import {
  TextInput,
  Textarea,
  Select,
  Icon,
} from "@powerhousedao/document-engineering";
import { toast, ToastContainer } from "@powerhousedao/design-system/connect";
import {
  actions,
  type NetworkCategory,
} from "../../document-models/network-profile/index.js";
import { useCallback, useState, useEffect } from "react";
import { useSelectedNetworkProfileDocument } from "../../document-models/network-profile/hooks.js";
import { DocumentToolbar } from "@powerhousedao/design-system/connect";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";

export type IProps = EditorProps;

// Category options for the dropdown
const categoryOptions: Array<{ value: NetworkCategory; label: string }> = [
  { value: "DEFI", label: "DeFi" },
  { value: "OSS", label: "Open Source Software" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "NGO", label: "NGO" },
  { value: "CHARITY", label: "Charity" },
];

// Image Modal Component
function ImageModal({
  isOpen,
  onClose,
  imageUrl,
  imageAlt,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  if (!isOpen) return null;

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.target as HTMLImageElement;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  };

  // Calculate modal size based on image dimensions with padding
  const getModalSize = () => {
    if (!imageLoaded) return { width: "auto", height: "auto" };

    const maxWidth = Math.min(
      imageDimensions.width + 100,
      window.innerWidth * 0.8,
    );
    const maxHeight = Math.min(
      imageDimensions.height + 100,
      window.innerHeight * 0.8,
    );

    return {
      width: `${maxWidth}px`,
      height: `${maxHeight}px`,
    };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-lg shadow-2xl border-2 border-gray-700"
        style={getModalSize()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg"
        >
          <Icon name="ArrowLeft" size={16} />
        </button>
        <div className="w-full h-full flex items-center justify-center p-8">
          <img
            src={imageUrl}
            alt={imageAlt}
            className={`max-w-full max-h-full object-contain rounded-lg ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } transition-opacity duration-200`}
            onClick={(e) => e.stopPropagation()}
            onLoad={handleImageLoad}
          />
        </div>
      </div>
    </div>
  );
}

// Image URL input component with preview
function ImageUrlInput({
  label,
  value,
  onChange,
  placeholder,
  fileSize = "200KB",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  fileSize?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Reset image error when value changes
  useEffect(() => {
    setImageError(false);
  }, [value]);

  const handleImageClick = () => {
    if (
      value &&
      !imageError &&
      (value.startsWith("http://") || value.startsWith("https://"))
    ) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`flex-shrink-0 w-12 h-12 bg-gray-100 rounded border flex items-center justify-center overflow-hidden ${
                  value &&
                  !imageError &&
                  (value.startsWith("http://") || value.startsWith("https://"))
                    ? "cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    : ""
                }`}
                onClick={handleImageClick}
              >
                {value &&
                !imageError &&
                (value.startsWith("http://") ||
                  value.startsWith("https://")) ? (
                  <img
                    src={value}
                    alt={`${label} preview`}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <Icon name="Image" size={24} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {value || placeholder || `${label.replace(":", "")}.jpg`}
                </div>
                <div className="text-xs text-gray-500">
                  File Type: jpg | File Size: {value ? fileSize : "0KB"}
                  {imageError && value && (
                    <div className="text-red-500 mt-1">
                      ⚠ Failed to load image
                    </div>
                  )}
                  {value &&
                    !imageError &&
                    (value.startsWith("http://") ||
                      value.startsWith("https://")) && (
                      <div className="text-blue-600 mt-1">
                        💡 Click image to view full size
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                <Icon name="Image" size={16} className="text-gray-600" />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <TextInput
              className="w-full"
              defaultValue={value || ""}
              onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                if (e.target.value !== value) {
                  onChange(e.target.value);
                }
              }}
              placeholder={placeholder || "Enter image URL"}
            />
          </div>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        imageUrl={value}
        imageAlt={`${label} full size`}
      />
    </>
  );
}

// Toggle-enabled image input component for light/dark theme switching
function ToggleableImageInput({
  label,
  lightValue,
  darkValue,
  onLightChange,
  onDarkChange,
  lightPlaceholder,
  darkPlaceholder,
  fileSize = "200KB",
}: {
  label: string;
  lightValue: string;
  darkValue: string;
  onLightChange: (value: string) => void;
  onDarkChange: (value: string) => void;
  lightPlaceholder?: string;
  darkPlaceholder?: string;
  fileSize?: string;
}) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="flex items-center space-x-2">
          <span
            className={`text-xs font-medium ${
              !isDarkMode ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Light
          </span>
          <button
            type="button"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isDarkMode ? "bg-gray-700" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span
            className={`text-xs font-medium ${
              isDarkMode ? "text-gray-900" : "text-gray-500"
            }`}
          >
            Dark
          </span>
        </div>
      </div>
      {!isDarkMode ? (
        <ImageUrlInput
          label=""
          value={lightValue}
          onChange={onLightChange}
          placeholder={lightPlaceholder}
          fileSize={fileSize}
        />
      ) : (
        <ImageUrlInput
          label=""
          value={darkValue}
          onChange={onDarkChange}
          placeholder={darkPlaceholder}
          fileSize={fileSize}
        />
      )}
    </div>
  );
}

export default function Editor() {
  // Getting dispatch from selected document
  const [doc, dispatch] = useSelectedNetworkProfileDocument();
  const state = doc?.state.global;
  if (!doc) {
    return null;
  }

  // Handle field changes
  const handleFieldChange = useCallback(
    (field: string, value: string | string[] | null) => {
      if (!dispatch) {
        console.error("Dispatch function not available");
        toast(`Failed to update ${field} - no dispatch function`, {
          type: "error",
        });
        return;
      }

      let action;
      switch (field) {
        case "name":
          action = actions.setProfileName({ name: value as string });
          break;
        case "icon":
          action = actions.setIcon({
            icon: value as string,
            darkThemeIcon: state?.darkThemeIcon || "",
          });
          break;
        case "darkThemeIcon":
          action = actions.setIcon({
            icon: state?.icon || "",
            darkThemeIcon: value as string,
          });
          break;
        case "logo":
          action = actions.setLogo({
            logo: value as string,
            darkThemeLogo: state?.darkThemeLogo || "",
          });
          break;
        case "darkThemeLogo":
          action = actions.setLogo({
            logo: state?.logo || "",
            darkThemeLogo: value as string,
          });
          break;
        case "logoBig":
          action = actions.setLogoBig({ logoBig: value as string });
          break;
        case "website":
          action = actions.setWebsite({ website: value as string | null });
          break;
        case "description":
          action = actions.setDescription({ description: value as string });
          break;
        case "category":
          action = actions.setCategory({
            category: value as NetworkCategory[],
          });
          break;
        case "x":
          action = actions.setX({ x: value as string | null });
          break;
        case "github":
          action = actions.setGithub({ github: value as string | null });
          break;
        case "discord":
          action = actions.setDiscord({ discord: value as string | null });
          break;
        case "youtube":
          action = actions.setYoutube({ youtube: value as string | null });
          break;
        default:
          console.error(`Unknown field: ${field}`);
          return;
      }

      dispatch(action);
    },
    [dispatch, state],
  );

  // Get the parent folder node for the currently selected node
  const parentFolder = useParentFolderForSelectedNode();

  // Set the selected node to the parent folder node (close the editor)
  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <DocumentToolbar document={doc} onClose={handleClose} />
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Network Profile
          </h1>
        </div>

        {/* Main Form Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            {/* Network Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Network Name:
              </label>
              <TextInput
                className="w-full"
                defaultValue={state?.name || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state?.name) {
                    handleFieldChange("name", e.target.value);
                  }
                }}
                placeholder="Enter network name"
              />
            </div>

            {/* Icon URL with Dark Theme Toggle */}
            <ToggleableImageInput
              label="Icon:"
              lightValue={state?.icon || ""}
              darkValue={state?.darkThemeIcon || ""}
              onLightChange={(value) => handleFieldChange("icon", value)}
              onDarkChange={(value) =>
                handleFieldChange("darkThemeIcon", value)
              }
              lightPlaceholder="PowerhouseIcon.jpg"
              darkPlaceholder="PowerhouseIconDark.jpg"
              fileSize="200KB"
            />

            {/* Logo URL with Dark Theme Toggle */}
            <ToggleableImageInput
              label="Logo:"
              lightValue={state?.logo || ""}
              darkValue={state?.darkThemeLogo || ""}
              onLightChange={(value) => handleFieldChange("logo", value)}
              onDarkChange={(value) =>
                handleFieldChange("darkThemeLogo", value)
              }
              lightPlaceholder="PowerhouseLogo.jpg"
              darkPlaceholder="PowerhouseLogoDark.jpg"
              fileSize="2MB"
            />

            {/* Large Logo URL */}
            <ImageUrlInput
              label="Large Logo:"
              value={state?.logoBig || ""}
              onChange={(value) => handleFieldChange("logoBig", value)}
              placeholder="LargeLogo.jpg"
              fileSize="10MB"
            />

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website:
              </label>
              <TextInput
                className="w-full"
                defaultValue={state?.website || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  const value = e.target.value || null;
                  if (value !== state?.website) {
                    handleFieldChange("website", value);
                  }
                }}
                placeholder="Enter website URL"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description:
              </label>
              <Textarea
                className="w-full"
                defaultValue={state?.description || ""}
                onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
                  if (e.target.value !== state?.description) {
                    handleFieldChange("description", e.target.value);
                  }
                }}
                placeholder="Enter network description"
                rows={4}
              />
            </div>

            {/* Category */}
            <div>
              <Select
                label="Category:"
                options={categoryOptions}
                value={state?.category?.[0] || undefined}
                onChange={(value) =>
                  handleFieldChange("category", [value as NetworkCategory])
                }
              />
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                Social Media Links
              </h3>

              {/* X Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  X Link:
                </label>
                <TextInput
                  className="w-full"
                  defaultValue={state?.x || ""}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const value = e.target.value || null;
                    if (value !== state?.x) {
                      handleFieldChange("x", value);
                    }
                  }}
                  placeholder="https://x.com/YourHandle"
                />
              </div>

              {/* Discord Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discord Link:
                </label>
                <TextInput
                  className="w-full"
                  defaultValue={state?.discord || ""}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const value = e.target.value || null;
                    if (value !== state?.discord) {
                      handleFieldChange("discord", value);
                    }
                  }}
                  placeholder="https://discord.com/invite/YourServer"
                />
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube Link:
                </label>
                <TextInput
                  className="w-full"
                  defaultValue={state?.youtube || ""}
                  onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                    const value = e.target.value || null;
                    if (value !== state?.youtube) {
                      handleFieldChange("youtube", value);
                    }
                  }}
                  placeholder="https://www.youtube.com/YourChannel"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer />
      </div>
    </div>
  );
}
