import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Testimonials from './Testimonials';
import { loadSiteSettings, onSiteSettingsUpdated } from '@/utils/settingsCache';

const ConditionalTestimonials = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTestimonialsEnabled();

    // Listen for real-time updates from admin panel
    const unsubscribe = onSiteSettingsUpdated(() => {
      checkTestimonialsEnabled();
    });

    return () => unsubscribe();
  }, []);

  const checkTestimonialsEnabled = async () => {
    try {
      // First try to get from database
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_value')
        .eq('setting_key', 'testimonials_enabled')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // Try cache fallback
        const cached = loadSiteSettings();
        const enabled = cached?.['testimonials_enabled'] === 'true';
        setIsEnabled(enabled);
        setIsLoading(false);
        return;
      }

      // If no setting exists, default to false (hidden)
      const enabled = data?.setting_value === 'true';
      setIsEnabled(enabled);
    } catch (err) {
      // Try cache fallback
      const cached = loadSiteSettings();
      const enabled = cached?.['testimonials_enabled'] === 'true';
      setIsEnabled(enabled);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner if you prefer
  }

  if (!isEnabled) {
    return null; // Don't render testimonials if disabled
  }

  return <Testimonials />;
};

export default ConditionalTestimonials;