import { useState, useEffect } from "react";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


interface Work {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  date: string;
}

interface Profile {
  name: string;
  bio: string;
  email: string;
  phone?: string;
  avatar?: string;
  Instagram?: string;
  Github?: string;
}

export const UserPage = () => {
  const [works, setWorks] = useState<Work[]>([]);
  const [profile, setProfile] = useState<Profile>({
    name: "Muhammad Ilham Hakiki",
    bio: "Envisioning growth through art — where creativity evolves and vision inspires every creation.",
    email: "ilhamhakiki2304@gmail.com",
    phone: "+62 838-7237-3094",
    Instagram : "https://www.instagram.com/mh_ilhamhakiki?igsh=Y2l6NWRydm1pMjR3",
    Github : "https://github.com/IlhamSKie-10",
    avatar: "/images/profil.jpg"
  });

  useEffect(() => {
    // Load works from localStorage
    const savedWorks = localStorage.getItem('portfolioWorks');
    if (savedWorks) {
      setWorks(JSON.parse(savedWorks));
    } else {
      // Generate sample works if none exist
      const sampleWorks = generateSampleWorks();
      setWorks(sampleWorks);
      localStorage.setItem('portfolioWorks', JSON.stringify(sampleWorks));
    }

    // Load profile from localStorage
    const savedProfile = localStorage.getItem('portfolioProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const generateSampleWorks = (): Work[] => {
    return [
      {
        id: '1',
        imageUrl: '/images/Alone.jpg', 
        title: 'Home Alone',
        description: 'A modern abstract piece exploring form and color',
        date: new Date().toISOString()
      }
    ];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-6 space-y-12">
        {/* Profile Section */}
        <div className="glass-card rounded-2xl p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <Avatar className="w-32 h-32 border-4 border-primary shadow-glow">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-primary text-primary-foreground">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {profile.name}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {profile.bio}
              </p>
              
              <div className="space-y-2">
                <p className="flex items-center justify-center md:justify-start space-x-2">
                  <span className="text-primary">✉</span>
                  <span>{profile.email}</span>
                </p>
                {profile.phone && (
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="text-primary">📞</span>
                    <span>{profile.phone}</span>
                  </p>
                )}
                {profile.Instagram && (
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="text-primary">📷</span>
                    <a
                      href={profile.Instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Instagram
                    </a>
                  </p>
                )}
                {profile.Github && (
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span className="text-primary">💻</span>
                    <a
                      href={profile.Github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      GitHub
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Works Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-center">Featured Works</h2>
          <ImageCarousel works={works} />
        </div>
      </div>
    </div>
  );
};
