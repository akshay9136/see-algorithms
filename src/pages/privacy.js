import React from 'react';
import { Container, Typography, Box, Link } from '@mui/material';
import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - See Algorithms</title>
        <meta
          name="description"
          content="Privacy Policy for See Algorithms - Learn how we collect, use, and protect your data."
        />
      </Head>
      <Box maxWidth="md">
        <Typography variant="h5" component="h1" gutterBottom fontWeight={600}>
          Privacy Policy
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: 2 Oct 2025
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to See Algorithms ({'"we," "our," or "us"'}). This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website see-algorithms.com (the
            {'"Site"'}). Please read this privacy policy carefully. If you do
            not agree with the terms of this privacy policy, please do not
            access the site.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            2. Information We Collect
          </Typography>
          <Typography variant="body1" paragraph>
            We may collect information about you in a variety of ways. The
            information we may collect on the Site includes:
          </Typography>

          <Typography variant="body1" component="div" sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph>
              <strong>Personal Data:</strong> We do not collect personal
              information such as names, email addresses, or phone numbers
              unless you voluntarily provide them.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Usage Data:</strong> We may collect information about how
              you access and use the Site, including your IP address, browser
              type, operating system, and pages visited.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Local Storage:</strong> We use localStorage only to
              remember your cookie consent preference. We do not store your
              algorithm data, graph visualizations, or learning preferences.
            </Typography>
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            3. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We do not actively collect or store personal information. However,
            Google AdSense may collect data through cookies for advertising
            purposes. We use the information we collect to:
          </Typography>

          <Typography variant="body1" component="div" sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph>
              • Improve, personalize, and expand our Site
            </Typography>
            <Typography variant="body1" paragraph>
              • Remember your cookie consent preference
            </Typography>
            <Typography variant="body1" paragraph>
              • Display relevant ads through Google AdSense
            </Typography>
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            4. Google AdSense
          </Typography>
          <Typography variant="body1" paragraph>
            We use Google AdSense to display advertisements on our Site. Google
            AdSense may use cookies and similar technologies to serve ads based
            on your visits to our Site and other sites on the Internet. You may
            opt out of personalized advertising by visiting{' '}
            <Link
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener"
            >
              Google Ad Settings
            </Link>
            .
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            5. Cookies and Local Storage
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and local storage to enhance your experience on our
            Site. Cookies are small data files stored on your device. Local
            storage allows us to save your cookie consent preference locally on
            your device.
          </Typography>
          <Typography variant="body1" paragraph>
            You can control cookie settings through your browser preferences.
            However, disabling cookies may affect the functionality of our Site.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            6. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement appropriate security measures to protect your
            information. However, no method of transmission over the Internet or
            electronic storage is 100% secure. While we strive to protect your
            personal information, we cannot guarantee its absolute security.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            7. Third-Party Services
          </Typography>
          <Typography variant="body1" paragraph>
            Our Site may contain links to third-party websites. We are not
            responsible for the privacy practices of these external sites. We
            encourage you to review the privacy policies of any third-party
            sites you visit.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            8. Children&apos;s Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our Site is designed for educational purposes and is suitable for
            users of all ages. We do not knowingly collect personal information
            from children under 13. If you are a parent or guardian and believe
            your child has provided us with personal information, please contact
            us.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            9. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the {'"Last updated"'} date. You are advised to review
            this Privacy Policy periodically for any changes.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            10. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </Typography>
          <Typography variant="body1" paragraph>
            Email: akarande777@outlook.com
          </Typography>
        </Box>
      </Box>
    </>
  );
}
