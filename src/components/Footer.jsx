import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterContainer = styled('footer')({
  backgroundColor: '#f8f9fa',
  padding: '3rem 0',
  marginTop: 'auto',
});

const FooterContent = styled('div')({
  maxWidth: '1200px',
  margin: '0 auto',
  padding: '0 1rem',
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '2rem',
});

const FooterSection = styled('div')({
  '& h3': {
    color: '#333',
    marginBottom: '1rem',
    fontSize: '1.2rem',
  },
  '& p': {
    color: '#666',
    marginBottom: '0.5rem',
  }
});

const SocialLinks = styled('div')({
  display: 'flex',
  gap: '1rem',
  '& a': {
    color: '#007bff',
    textDecoration: 'none',
    '&:hover': {
      color: '#0056b3',
      textDecoration: 'underline',
    }
  }
});

const FooterBottom = styled('div')({
  borderTop: '1px solid #eee',
  marginTop: '2rem',
  paddingTop: '1rem',
  textAlign: 'center',
  color: '#666',
});

const Footer = () => {
  const [footer, setFooter] = useState(null);

  useEffect(() => {
    fetch('/api/footer')
      .then(res => res.json())
      .then(data => setFooter(data))
      .catch(() => setFooter(null));
  }, []);

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About Us</h3>
          <p>{footer ? footer.about_us : '...'}</p>
        </FooterSection>
        <FooterSection>
          <h3>Contact</h3>
          <p>Email: {footer ? footer.contact_email : '...'}</p>
          <p>Phone: {footer ? footer.contact_phone : '...'}</p>
        </FooterSection>
        <FooterSection>
          <h3>Follow Us</h3>
          <SocialLinks>
            {footer && footer.facebook && (
              <a href={footer.facebook} target="_blank" rel="noopener noreferrer">
                <FacebookIcon style={{ verticalAlign: 'middle', marginRight: 4 }} /> Facebook
              </a>
            )}
            {footer && footer.twitter && (
              <a href={footer.twitter} target="_blank" rel="noopener noreferrer">
                <TwitterIcon style={{ verticalAlign: 'middle', marginRight: 4 }} /> Twitter
              </a>
            )}
            {footer && footer.instagram && (
              <a href={footer.instagram} target="_blank" rel="noopener noreferrer">
                <InstagramIcon style={{ verticalAlign: 'middle', marginRight: 4 }} /> Instagram
              </a>
            )}
          </SocialLinks>
        </FooterSection>
      </FooterContent>
      <FooterBottom>
        <p>&copy; 2024 Store. All rights reserved.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer; 