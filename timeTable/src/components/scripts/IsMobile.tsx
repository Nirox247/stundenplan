import React, { useState, useEffect } from 'react';

    const isMobile = () => {
      const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768); // Beispiel-Breakpoint für mobile (Tailwind md)
        };

        handleResize(); // Initial prüfen
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
        console.log(isMobile)
      }, []);

      return (
        <div>
          {isMobile ? (
            // Inhalt für Handys
            <p>Dies ist für mobile Geräte sichtbar.</p>
          ) : (
            // Inhalt für Desktops/größere Bildschirme
            <p>Dies ist für größere Bildschirme sichtbar.</p>
          )}
        </div>
      );
    };
    export default isMobile;
