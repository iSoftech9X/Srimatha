import React, { useState } from 'react';
import { X } from 'lucide-react';
import gallery1 from '../Images/gallery1.jpg';
import gallery2 from '../Images/gallery2.jpg';
import gallery3 from '../Images/gallery3.jfif';
import gallery5 from '../Images/gallery5.jpg';
import gallery6 from '../Images/gallery6.jpg';
import gallery7 from '../Images/gallery7.jpg';
import gallery8 from '../Images/gallery8.jpg';
import gallery9 from '../Images/gallery9.jpg';
import gallery10 from '../Images/gallery10.jpg'
// Gallery component to display images with lightbox effect 
const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
  
    {
      src: gallery1,
      alt: 'Elegant dining room',
      category: 'Interior'
    },
    {
      src: gallery2,
      alt: 'Gourmet dish presentation',
      category: 'Food'
    },
    {
      src: gallery3,
      alt: 'Chef at work',
      category: 'Kitchen'
    },
    {
      src:gallery5,
      alt:'Catering setup',
      category: 'Events'
    },
    {
      src: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop',
      alt: 'Butter chicken',
      category: 'Food'
    },
    {
      src: gallery6,
      alt: 'Food court area',
      category: 'Interior'
    },
    {
      src: gallery7,
      alt: 'Chocolate dessert',
      category: 'Food'
    },
    {
      src: gallery8,
      alt: 'Grilled salmon',
      category: 'Food'
    },
    {
      src: gallery9,
      alt: 'Restaurant ambiance',
      category: 'Interior'
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Event <span className="text-orange-600">Gallery</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take a visual journey through our culinary world, from exquisite dishes to memorable dining experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
              onClick={() => setSelectedImage(image.src)}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <span className="text-lg font-semibold">{image.alt}</span>
                  <div className="text-sm mt-1 px-3 py-1 bg-orange-600 rounded-full inline-block">
                    {image.category}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl max-h-full">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
              >
                <X size={32} />
              </button>
              <img
                src={selectedImage}
                alt="Gallery image"
                className="max-h-[60vh] max-w-[50vw] flex items-center justify-center"
              />
            </div>
          </div>
        )}

        {/* Testimonials */}
        <div className="mt-20 bg-gray-50 rounded-2xl p-8 md:p-12">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">What Our Guests Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Priya Sharma',
                review: 'The food quality and ambiance at Srimath is exceptional. Perfect for special occasions!',
                rating: 5
              },
              {
                name: 'Raj Patel',
                review: 'Amazing catering service for our wedding. Every guest was impressed with the variety and taste.',
                rating: 5
              },
              {
                name: 'Anita Singh',
                review: 'Great food court experience. Something for everyone in the family. Highly recommended!',
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.review}"</p>
                <div className="font-semibold text-gray-800">- {testimonial.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;