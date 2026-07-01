import { CustomSeo, ListItems } from '@/components/common';
import { Typography, Box, Link } from '@mui/material';

export default function RefundPolicy() {
  return (
    <>
      <CustomSeo />
      <Box maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom>
          Refund Policy
        </Typography>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          Last updated: 1 July 2026
        </Typography>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            1. Nature of Our Services
          </Typography>
          <Typography paragraph>
            See Algorithms ({'"the Site"'}) provides digital consumable goods in
            the form of AI Credits. These credits are used to generate custom
            explanations and summaries for visualized algorithms. Since AI
            Credits are instantly delivered and can be consumed immediately upon
            purchase, they are generally considered non-refundable once any part
            of the purchased credits has been used.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            2. Eligibility for Refunds
          </Typography>
          <Typography paragraph>
            We want you to be fully satisfied with your experience. You may
            request a refund for a credit pack purchase under the following
            conditions:
          </Typography>
          <ListItems>
            <Typography component="li">
              The refund request is made within 14 days of the transaction date.
            </Typography>
            <Typography component="li">
              The purchased credit pack is completely unused. We cannot issue
              partial refunds or refunds for packages where one or more credits
              have already been spent.
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            3. Refund Process
          </Typography>
          <Typography paragraph>
            To request a refund, please contact us by sending an email with the
            subject line {'"Refund Request"'} to:
          </Typography>
          <Typography paragraph sx={{ fontWeight: 'bold' }}>
            Email: hello@see-algorithms.com
          </Typography>
          <Typography paragraph>
            To help us expedite your request, please include the following
            details in your email:
          </Typography>
          <ListItems>
            <Typography component="li">
              The email address associated with your See Algorithms account.
            </Typography>
            <Typography component="li">
              The payment receipt, transaction ID, or order details.
            </Typography>
            <Typography component="li">
              The specific reason for the refund request (this helps us improve
              our platform).
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            4. Processing Timeline
          </Typography>
          <Typography paragraph>
            Once we receive and review your refund request, we will notify you
            of the approval or rejection of your refund. If approved:
          </Typography>
          <ListItems>
            <Typography component="li">
              Your refund will be processed, and a credit will automatically be
              applied to your original credit card or method of payment.
            </Typography>
            <Typography component="li">
              Please allow 5 to 7 business days for the refund transaction to
              reflect on your bank statement or credit card statement, depending
              on your financial institution and payment processor.
            </Typography>
          </ListItems>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            5. Limitations and Abuse
          </Typography>
          <Typography paragraph>
            We reserve the right to refuse refunds if we suspect abuse of our
            refund policy. This includes, but is not limited to, users who make
            repetitive purchases and refund requests, users whose accounts have
            been flagged or terminated for violating our Terms of Service, or
            requests made after the 14-day eligibility window.
          </Typography>

          <Typography variant="h6" gutterBottom fontWeight={600}>
            6. Contact Us
          </Typography>
          <Typography paragraph>
            If you have any questions or concerns about this Refund Policy,
            please reach out to us at:
          </Typography>
          <Typography paragraph>
            Email:{' '}
            <Link href="mailto:hello@see-algorithms.com">
              hello@see-algorithms.com
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
}
