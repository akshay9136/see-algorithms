import { CustomSeo, ListItems } from '@/components/common';
import { Typography, Box, Link } from '@mui/material';

export default function TermsOfService() {
  return (
    <>
      <CustomSeo />
      <Box maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Terms of Service
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: 1 July 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            1. Acceptance of Terms
          </Typography>
          <Typography paragraph>
            By accessing and using See Algorithms ({'"the Site"'}), you accept
            and agree to be bound by the terms and provision of this agreement.
            If you do not agree to abide by the above, please do not use this
            service.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            2. User Accounts
          </Typography>
          <Typography paragraph>
            To access certain features of the Site, including purchasing and
            using AI Credits, you must register for an account. We offer user
            registration and login services via secure third-party OAuth
            providers, specifically Google and GitHub. You agree to provide and
            maintain accurate, current, and complete profile information. You
            are solely responsible for maintaining the confidentiality of your
            account authentication session and credentials, and for all
            activities that occur under your account. You must notify us
            immediately of any unauthorized use of your account or security
            breach.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            3. Use License
          </Typography>
          <Typography paragraph>
            Permission is granted to temporarily access and use the Site for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </Typography>

          <ListItems>
            <Typography component="li">Modify or copy the materials</Typography>
            <Typography component="li">
              Use the materials for any commercial purpose or for any public
              display
            </Typography>
            <Typography component="li">
              Attempt to reverse engineer any software contained on the Site
            </Typography>
            <Typography component="li">
              Remove any copyright or other proprietary notations from the
              materials
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            4. Payments and Credits
          </Typography>
          <Typography paragraph>
            We offer various pricing plans for purchasing AI Credits, which are
            detailed on our pricing page. All payments are processed securely
            through our third-party payment gateway. By initiating a purchase,
            you agree to pay all charges incurred under your account at the
            prices in effect at the time of purchase. AI Credits purchased on
            the Site are one-time payments and do not expire. Credits are
            non-transferable and have no cash value. All fees are exclusive of
            applicable taxes. Except as explicitly stated in our{' '}
            <Link href="/refund-policy">Refund Policy</Link>, all purchases are
            final and non-refundable.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            5. Educational Purpose
          </Typography>
          <Typography paragraph>
            The Site is designed for educational purposes to help users
            understand algorithms through interactive visualizations. The
            content is provided for learning and educational use only. While we
            strive for accuracy, we make no warranties about the completeness,
            reliability, or accuracy of the educational content.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            6. User Responsibilities & Acceptable Use
          </Typography>
          <Typography paragraph>When using our Site, you agree to:</Typography>

          <ListItems>
            <Typography component="li">
              Use the Site only for lawful purposes and in accordance with
              these Terms
            </Typography>
            <Typography component="li">
              Not use the Site in any way that could damage, disable,
              overburden, or impair the Site&apos;s servers or networks
            </Typography>
            <Typography component="li">
              Not attempt to gain unauthorized access to any user accounts,
              computer systems, or networks
            </Typography>
            <Typography component="li">
              Not reverse engineer, decompile, or disassemble any software,
              algorithms, or visualizer code contained on the Site
            </Typography>
            <Typography component="li">
              Not use automated scrapers, bots, or script tools to extract
              data, content, or abuse the AI Credits system
            </Typography>
            <Typography component="li">
              • Respect the educational nature of the content and use it
              appropriately
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            7. Intellectual Property Rights
          </Typography>
          <Typography paragraph>
            The Site and its original content, features, and functionality are
            and will remain the exclusive property of See Algorithms and its
            licensors. The Site is protected by copyright, trademark, and other
            laws. Our trademarks and trade dress may not be used in connection
            with any product or service without our prior written consent.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            8. Disclaimer
          </Typography>
          <Typography paragraph>
            The information on this Site is provided on an {'"as is"'} basis. To
            the fullest extent permitted by law, See Algorithms excludes all
            representations, warranties, conditions and terms relating to our
            Site and the use of this Site. Nothing in this disclaimer will:
          </Typography>

          <ListItems>
            <Typography component="li">
              Limit or exclude our or your liability for death or personal
              injury
            </Typography>
            <Typography component="li">
              Limit or exclude our or your liability for fraud or fraudulent
              misrepresentation
            </Typography>
            <Typography component="li">
              Limit any of our or your liabilities in any way that is not
              permitted under applicable law
            </Typography>
            <Typography component="li">
              Exclude any of our or your liabilities that may not be excluded
              under applicable law
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            9. Limitation of Liability
          </Typography>
          <Typography paragraph>
            In no event shall See Algorithms or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on the Site, even if See Algorithms
            or an authorized representative has been notified orally or in
            writing of the possibility of such damage. Because some
            jurisdictions do not allow limitations on implied warranties, or
            limitations of liability for consequential or incidental damages,
            these limitations may not apply to you.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            10. Accuracy of Materials
          </Typography>
          <Typography paragraph>
            The materials appearing on the Site could include technical,
            typographical, or photographic errors. See Algorithms does not
            warrant that any of the materials on its website are accurate,
            complete, or current. See Algorithms may make changes to the
            materials contained on its website at any time without notice.
            However, See Algorithms does not make any commitment to update the
            materials.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            11. Links to Other Websites
          </Typography>
          <Typography paragraph>
            Our Site may contain links to third-party websites or services that
            are not owned or controlled by See Algorithms. We have no control
            over, and assume no responsibility for, the content, privacy
            policies, or practices of any third-party websites or services. You
            acknowledge and agree that See Algorithms shall not be responsible
            or liable for any damage or loss caused by or in connection with the
            use of any such content, goods, or services available on or through
            any such websites or services.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            12. Termination
          </Typography>
          <Typography paragraph>
            We may terminate or suspend your access immediately, without prior
            notice or liability, for any reason whatsoever, including without
            limitation if you breach the Terms. Upon termination, your right to
            use the Site will cease immediately.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            13. Governing Law
          </Typography>
          <Typography paragraph>
            These Terms shall be interpreted and governed by the laws of the
            jurisdiction in which See Algorithms operates, without regard to its
            conflict of law provisions. Our failure to enforce any right or
            provision of these Terms will not be considered a waiver of those
            rights.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            14. Changes to Terms
          </Typography>
          <Typography paragraph>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material, we will try to
            provide at least 30 days notice prior to any new terms taking
            effect. What constitutes a material change will be determined at our
            sole discretion.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            15. Contact Information
          </Typography>
          <Typography paragraph>
            If you have any questions about these Terms of Service, please
            contact us at:
          </Typography>
          <Typography paragraph>Email: hello@see-algorithms.com</Typography>
          <Typography paragraph>
            Website:{' '}
            <Link href="https://see-algorithms.com">see-algorithms.com</Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
