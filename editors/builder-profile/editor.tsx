import type { EditorProps } from "document-model";
import { TextInput, Textarea, Icon } from "@powerhousedao/document-engineering";
import { toast, ToastContainer } from "@powerhousedao/design-system";
import { actions } from "../../document-models/builder-profile/index.js";
import { useCallback, useState, useEffect, useRef } from "react";
import { useSelectedBuilderProfileDocument } from "../hooks/useBuilderProfileDocument.js";
import { generateId } from "document-model";

export type IProps = EditorProps;

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
      window.innerWidth * 0.8
    );
    const maxHeight = Math.min(
      imageDimensions.height + 100,
      window.innerHeight * 0.8
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
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
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
              <div className="flex-1 min-w-0">
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

export default function Editor() {
  // Getting dispatch from selected document
  const [doc, dispatch] = useSelectedBuilderProfileDocument();
  const state = doc.state.global;

  // Track if we've already attempted to generate an ID
  const idGeneratedRef = useRef(false);

  // Auto-generate ID if not present (only once)
  useEffect(() => {
    if (!state?.id && !idGeneratedRef.current && dispatch) {
      idGeneratedRef.current = true; // Mark as attempted
      const newId = generateId();
      dispatch(
        actions.updateProfile({
          id: newId,
        })
      );
    }
  }, [state?.id, dispatch]);

  // Generate slug from name
  const generateSlug = useCallback((name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces and hyphens
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
  }, []);

  // Handle field changes using the UPDATE_PROFILE operation
  const handleFieldChange = useCallback(
    (field: string, value: string | null) => {
      if (!dispatch) {
        console.error("Dispatch function not available");
        toast(`Failed to update ${field} - no dispatch function`, {
          type: "error",
        });
        return;
      }

      // If updating name and value is not empty, also update slug
      if (field === "name" && value && value.trim()) {
        const slug = generateSlug(value);
        dispatch(
          actions.updateProfile({
            name: value,
            slug: slug,
          })
        );
      } else {
        // Only update the changed field along with id
        const updateAction = actions.updateProfile({
          [field]: value,
        });
        dispatch(updateAction);
      }
    },
    [dispatch, generateSlug]
  );

  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Builder Profile
          </h1>
          <p className="text-gray-600">
            Create and manage your builder profile information
          </p>
        </div>

        {/* Profile Preview Section */}
        {state && (state.name || state.icon || state.description) && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Profile Preview
            </h3>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {state.icon ? (
                    <img
                      src={state.icon}
                      alt="Profile icon"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                      <Icon name="Image" size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {state.name || "Unnamed Builder"}
                  </h4>
                  {state.slug && (
                    <p className="text-sm text-gray-500 mb-2">@{state.slug}</p>
                  )}
                  {state.description && (
                    <p className="text-gray-700">{state.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Form Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="space-y-6">
            {/* ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Builder ID:
              </label>
              <div className="text-sm text-gray-500 flex items-center">
                <span className="mr-2">{state?.id}</span>
                {state?.id && (
                  <button
                    type="button"
                    className="ml-1 p-1 rounded transition active:bg-gray-400 hover:bg-gray-200"
                    title="Copy Builder ID"
                    onClick={() => {
                      navigator.clipboard.writeText(state.id || "");
                      toast("Copied Builder ID!", {
                        type: "success",
                      });
                    }}
                  >
                    <Icon name="Copy" size={16} className="text-gray-400" />
                  </button>
                )}
              </div>
            </div>

            {/* Builder Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Builder Name:
              </label>
              <TextInput
                className="w-full"
                defaultValue={state?.name || ""}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                  if (e.target.value !== state?.name) {
                    handleFieldChange("name", e.target.value);
                  }
                }}
                placeholder="Enter your name"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Slug:
              </label>
              <TextInput
                className="w-full"
                value={state?.slug || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  handleFieldChange("slug", e.target.value);
                }}
                placeholder="your-profile-slug"
              />
              <p className="text-xs text-gray-500 mt-1">
                Used for your profile URL (lowercase, no spaces)
              </p>
            </div>

            {/* Icon URL */}
            <ImageUrlInput
              label="Profile Icon:"
              value={state?.icon || ""}
              onChange={(value) => handleFieldChange("icon", value)}
              placeholder="BuilderIcon.jpg"
              fileSize="200KB"
            />

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
                placeholder="Tell us about yourself as a builder..."
                rows={4}
              />
            </div>
          </div>
        </div>

        {/* Toast Container */}
        <ToastContainer 
          position="bottom-right"
        />
      </div>
    </div>
  );
}
