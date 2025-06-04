
export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  userAgent: string;
  screenWidth: number;
}

export const detectDevice = (): DeviceInfo => {
  const userAgent = navigator.userAgent.toLowerCase();
  const screenWidth = window.innerWidth;
  
  // More comprehensive mobile detection
  const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(userAgent) || screenWidth < 768;
  
  // Tablet detection
  const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent) || (screenWidth >= 768 && screenWidth < 1024);
  
  // Desktop detection - must have larger screen AND not be mobile/tablet user agent
  const isDesktop = !isMobile && !isTablet && screenWidth >= 1024;
  
  return {
    isMobile,
    isTablet,
    isDesktop,
    userAgent,
    screenWidth
  };
};

export const isMobileDevice = (): boolean => {
  return detectDevice().isMobile || detectDevice().isTablet;
};

export const isRealDesktop = (): boolean => {
  const device = detectDevice();
  // Must be desktop with large screen and proper user agent
  return device.isDesktop && device.screenWidth >= 1024 && 
         !/mobile|tablet|android|iphone|ipad/i.test(device.userAgent);
};
