import { CustomSeo } from '@/components/common';
import { Typography, Box } from '@mui/material';

export default function Privacy() {
  return (
    <>
      <CustomSeo />
      <Box maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: 21 Dec 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            1. Introduction
          </Typography>
          <Typography paragraph>
            Welcome to See Algorithms ({'"we," "our," or "us"'}). This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website see-algorithms.com (the
            {' "Site"'}). Please read this privacy policy carefully. If you do
            not agree with the terms of this privacy policy, please do not
            access the site.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            2. Information We Collect
          </Typography>
          <Typography paragraph>
            We may collect information about you in a variety of ways. The
            information we may collect on the Site includes:
          </Typography>

          <Typography paragraph sx={{ pl: 2 }}>
            <Typography mb={1}>
              <strong>Personal Data:</strong> We do not collect personal
              information such as names, email addresses, or phone numbers
              unless you voluntarily provide them.
            </Typography>
            <Typography>
              <strong>Usage Data:</strong> We may collect information about how
              you access and use the Site, including your IP address, browser
              type, operating system, and pages visited.
            </Typography>
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            3. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use the information we collect to improve, personalize, and
            expand our Site. Additionally, third-party services such as Google
            AdSense may collect data through cookies for the purpose of
            displaying relevant advertisements. For more information, visit{' '}
            <a
              href="https://www.google.com/policies/privacy/partners/"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses data from sites that use their services
            </a>
            . We use the information we collect to:
          </Typography>

          <Typography paragraph sx={{ pl: 2 }}>
            <Typography mb={1}>
              • Improve, personalize, and expand our Site
            </Typography>
            <Typography>
              • Display relevant ads through Google AdSense
            </Typography>
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            4. Tracking Technologies
          </Typography>
          <Typography paragraph>
            We do not directly set cookies or use local storage for tracking
            purposes. However, third-party services integrated into our Site —
            including Google AdSense and Vercel Analytics — may use cookies, web
            beacons, or similar technologies to collect information for
            advertising and analytics purposes.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            5. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the Internet or
            electronic storage is 100% secure. While we strive to protect your
            personal information, we cannot guarantee its absolute security.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            6. Third-Party Services
          </Typography>
          <Typography paragraph>
            Our Site may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites. We
            encourage you to review the privacy policies of any third-party
            sites you visit.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            7. Children&apos;s Privacy
          </Typography>
          <Typography paragraph>
            Our Site is designed for educational purposes and is suitable for
            users of all ages. We do not knowingly collect personal information
            from children under 13. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact
            us.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            8. Changes to This Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the {'"Last updated"'} date. You are advised to review
            this Privacy Policy periodically for any changes.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            9. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </Typography>
          <Typography paragraph>Email: hello@see-algorithms.com</Typography>
        </Box>
      </Box>
    </>
  );
}
