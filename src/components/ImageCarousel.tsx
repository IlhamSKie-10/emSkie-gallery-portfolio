import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Pause, ExternalLink } from "lucide-react";

interface Work {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  date: string;
}

interface ImageCarouselProps {
  works: Work[];
}

export const ImageCarousel = ({ works }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isPlaying && works.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % works.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, works.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % works.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + works.length) % works.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const openFullView = () => {
    window.open(works[currentIndex]?.imageUrl, '_blank');
  };

  if (!works.length) {
    return (
      <div className="glass-card rounded-2xl p-12 text-center">
        <p className="text-muted-foreground text-lg">No works to display yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Carousel */}
      <div className="relative glass-card rounded-2xl overflow-hidden">
        <div className="relative aspect-video bg-background-secondary">
          <img
            src={works[currentIndex]?.imageUrl}
            alt={works[currentIndex]?.title || 'Portfolio work'}
            className="w-full h-full object-contain carousel-fade"
            style={{ maxHeight: '60vh' }}
          />
          
          {/* Navigation Buttons */}
          {works.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 glass-card hover:bg-primary/20"
                onClick={goToPrev}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 glass-card hover:bg-primary/20"
                onClick={goToNext}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            {works.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="glass-card hover:bg-primary/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="glass-card hover:bg-primary/20"
              onClick={openFullView}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Work Info */}
          {(works[currentIndex]?.title || works[currentIndex]?.description) && (
            <div className="absolute bottom-4 left-4 glass-card rounded-lg p-4 max-w-md">
              {works[currentIndex]?.title && (
                <h3 className="font-semibold text-lg mb-1">{works[currentIndex].title}</h3>
              )}
              {works[currentIndex]?.description && (
                <p className="text-muted-foreground text-sm">{works[currentIndex].description}</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Thumbnails */}
      {works.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {works.map((work, index) => (
            <button
              key={work.id}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                index === currentIndex 
                  ? 'thumbnail-active' 
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <img
                src={work.imageUrl}
                alt={work.title || 'Thumbnail'}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Work Counter */}
      <div className="text-center">
        <p className="text-muted-foreground">
          {works.length} work{works.length !== 1 ? 's' : ''} in collection
        </p>
      </div>
    </div>
  );
};