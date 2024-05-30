const main = {
  backgroundColor: "#ffffff",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "20px 80px 40px",
  padding: "20px 0 48px",
};

const header = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // Ajout de la justification pour centrer horizontalement
  marginBottom: "20px",
};

const logo = {
  marginRight: "10px",
};

const clinicName = {
  fontSize: "20px",
  fontWeight: "bold",
  marginTop: "9px", 
  marginRight: "12px", 
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
};

const KoalaWelcomeEmail = (bodyContent, logoCid) => {
  return {
    type: "html",
    data: `
      <html>
        <head></head>
        <body style="background-color: ${main.backgroundColor}; font-family: ${main.fontFamily};">
          <div style="margin: ${container.margin}; padding: ${container.padding};">
            <div style="display: ${header.display}; align-items: ${header.alignItems}; justify-content: ${header.justifyContent}; margin-bottom: ${header.marginBottom};">
              <img src="cid:${logoCid}" alt="Logo" width="60" height="50" style="margin-right: ${logo.marginRight};" />
              <span style="font-size: ${clinicName.fontSize}; font-weight: ${clinicName.fontWeight}; margin-top: ${clinicName.marginTop}; margin-left: ${clinicName.marginLeft};">Centre SantéPlus</span>
            </div>
            <p style="font-size: ${paragraph.fontSize}; line-height: ${paragraph.lineHeight};">${bodyContent}</p>
          </div>
        </body>
      </html>
    `,
  };
};

module.exports = KoalaWelcomeEmail;
