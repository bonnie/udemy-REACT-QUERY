import { Image } from "@chakra-ui/react";

import splashImg from "@/images/splash.jpg";

export function BackgroundImage() {
  return (
    <Image
      minHeight="100%"
      minWidth="1024px"
      width="100%"
      height="auto"
      position="fixed"
      top="0"
      left="0"
      zIndex="-1"
      src={splashImg}
      alt="peaceful orchids and stacked rocks"
    />
  );
}
