import { TextInput, Icon } from "@powerhousedao/document-engineering";
import { useState, useEffect } from "react";

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
        className="relative rounded-lg border-2 border-gray-700 bg-gray-900 shadow-2xl"
        style={getModalSize()}
      >
        <button
          onClick={onClose}
          className="absolute -right-3 -top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-all duration-200 hover:bg-gray-900"
        >
          <Icon name="ArrowLeft" size={16} />
        </button>
        <div className="flex h-full w-full items-center justify-center p-8">
          <img
            src={imageUrl}
            alt={imageAlt}
            className={`max-h-full max-w-full rounded-lg object-contain ${
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
export function ImageUrlInput({
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
        <div className="rounded-lg border border-gray-300 p-4">
          <div className="flex items-center justify-between overflow-hidden">
            <div className="flex min-w-0 items-center space-x-3">
              <div
                className={`flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded border bg-gray-100 ${
                  value &&
                  !imageError &&
                  (value.startsWith("http://") || value.startsWith("https://"))
                    ? "cursor-pointer transition-opacity duration-200 hover:opacity-80"
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
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                    onLoad={() => setImageError(false)}
                  />
                ) : (
                  <Icon name="Image" size={24} className="text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-gray-900">
                  {value || placeholder || `${label.replace(":", "")}.jpg`}
                </div>
                <div className="text-xs text-gray-500">
                  File Type: jpg | File Size: {value ? fileSize : "0KB"}
                  {imageError && value && (
                    <div className="mt-1 text-red-500">
                      Failed to load image
                    </div>
                  )}
                  {value &&
                    !imageError &&
                    (value.startsWith("http://") ||
                      value.startsWith("https://")) && (
                      <div className="mt-1 text-blue-600">
                        Click image to view full size
                      </div>
                    )}
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
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
