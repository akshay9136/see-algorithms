import { CustomSeo, ListItems } from '@/components/common';
import { Typography, Box, Link } from '@mui/material';

export default function Privacy() {
  return (
    <>
      <CustomSeo />
      <Box maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Privacy Policy
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: 1 July 2026
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
            We collect information about you in a variety of ways when you
            interact with our Site:
          </Typography>

          <ListItems>
            <Typography component="li">
              <strong>Account and Profile Data:</strong> When you sign in to our
              Site using third-party identity providers (Google and GitHub
              OAuth), we collect your name, email address, profile picture, and
              authentication provider ID. This information is saved in our
              database to manage your account and allocate your AI Credits.
            </Typography>
            <Typography component="li">
              <strong>Transaction Logs:</strong> If you purchase AI Credits, we
              store logs of the transaction (including the plan purchased,
              transaction amount, payment date, email address, and account
              identifier). Actual payment details (such as credit card numbers)
              are processed directly and securely by our third-party payment
              processor and are never stored on our servers.
            </Typography>
            <Typography component="li">
              <strong>Usage Data:</strong> We automatically collect information
              about how you access and use the Site, including your IP address,
              browser type, operating system, and the pages you visit.
            </Typography>
            <Typography component="li">
              <strong>Interaction Data:</strong> We log user interface
              interactions, such as button clicks and visualizer actions, to
              diagnose performance issues and improve our educational content.
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            3. How We Use Your Information
          </Typography>
          <Typography paragraph>
            We use the information we collect to operate, maintain, and improve
            our services:
          </Typography>

          <ListItems>
            <Typography component="li">
              To manage your user account and verify your identity during
              sign-in.
            </Typography>
            <Typography component="li">
              To track, allocate, and deduct AI Credits that you purchase or
              consume.
            </Typography>
            <Typography component="li">
              To process payments and maintain financial records.
            </Typography>
            <Typography component="li">
              To optimize, analyze, and improve the user experience and
              visualizer tool functionality.
            </Typography>
            <Typography component="li">
              To serve relevant advertisements through third-party services like
              Google AdSense.
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            4. Tracking Technologies and Cookies
          </Typography>
          <Typography paragraph>
            We and our third-party partners use cookies, local storage, and
            similar technologies to enhance your experience:
          </Typography>
          <ListItems>
            <Typography component="li">
              <strong>Authentication:</strong> NextAuth sets session cookies to
              keep you signed in and secure your account session.
            </Typography>
            <Typography component="li">
              <strong>Advertising:</strong> Google AdSense uses cookies to serve
              personalized ads based on your visits to our Site and other
              websites. For more details on how Google manages advertising data,
              visit{' '}
              <Link
                href="https://www.google.com/policies/privacy/partners/"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses data from sites that use their services
              </Link>
              .
            </Typography>
            <Typography component="li">
              <strong>Analytics:</strong> Third-party tools such as Vercel
              Analytics may collect anonymous metrics about traffic patterns and
              page loading speeds.
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            5. Data Security
          </Typography>
          <Typography paragraph>
            We implement appropriate technical and organizational security
            measures to protect your personal information. However, no method of
            transmission over the Internet or electronic storage is 100% secure.
            While we strive to protect your personal information, we cannot
            guarantee its absolute security.
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
            8. User Rights
          </Typography>
          <Typography paragraph>
            Depending on your location, you may have specific rights regarding
            your personal information under applicable regulations (such as
            GDPR, CCPA, or other global privacy standards). These rights
            include:
          </Typography>
          <ListItems>
            <Typography component="li">
              <strong>Access:</strong> The right to request copies of the
              personal data we hold about you.
            </Typography>
            <Typography component="li">
              <strong>Correction:</strong> The right to request that we correct
              any inaccurate or incomplete details.
            </Typography>
            <Typography component="li">
              <strong>Deletion:</strong> The right to request that we delete
              your account and associated personal data from our systems.
            </Typography>
          </ListItems>
          <Typography paragraph>
            To exercise any of these rights, please contact us at:{' '}
            <Link href="mailto:hello@see-algorithms.com">
              hello@see-algorithms.com
            </Link>
            . We will respond to your request within the legally required
            timeframe.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            9. Changes to This Privacy Policy
          </Typography>
          <Typography paragraph>
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the {'"Last updated"'} date. You are advised to review
            this Privacy Policy periodically for any changes.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            10. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions about this Privacy Policy, please contact
            us at:
          </Typography>
          <Typography gutterBottom>
            Email:{' '}
            <Link href="mailto:hello@see-algorithms.com">
              hello@see-algorithms.com
            </Link>
          </Typography>
          <Typography>Legal Entity: Akshay Karande</Typography>
        </Box>
      </Box>
    </>
  );
}
