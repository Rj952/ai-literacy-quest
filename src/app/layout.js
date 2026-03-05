export const metadata = {
  title: 'AI Literacy Quest — CARE · CRAFT · ACRE Board Game',
  description: 'An interactive board game teaching AI literacy through the CARE, CRAFT, and ACRE frameworks. Created by Dr. Rohan Jowallah, Ed.D., FHEA.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: "Georgia, 'Times New Roman', serif", background: '#080612', color: '#e2e8f0', WebkitFontSmoothing: 'antialiased' }}>
        {children}
      </body>
    </html>
  );
}

