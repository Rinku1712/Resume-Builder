import DOMPurify from 'dompurify';

export default function ResumePreview({ resume }) {
  const color = resume.themeColor || '#f5c400';

  const initial = resume.fullName ? resume.fullName.trim().charAt(0).toUpperCase() : 'Y';

  const headingStyle = {
    borderBottom: `2px solid ${color}`,
    paddingBottom: '6px',
    fontSize: '20px',
  };

  const sectionStyle = {
    marginBottom: '25px',
  };

  const contentStyle = {
    fontSize: '14px',
    lineHeight: 1.6,
    overflowWrap: 'anywhere',
  };

  // Safely render HTML from React Quill
  const renderHtml = (content, fallback = '') => ({
    __html: DOMPurify.sanitize(content || fallback),
  });

  return (
    <div
      className="resume-preview"
      style={{
        background: 'white',
        padding: '25px',
        fontFamily: 'Arial, sans-serif',
        color: '#222',
        maxWidth: '800px',
        margin: 'auto',
        borderRadius: '15px',
        boxShadow: '0 2px 10px #ddd',
        boxSizing: 'border-box',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '30px',
          borderBottom: `3px solid ${color}`,
          paddingBottom: '20px',
        }}
      >
        {/* First letter instead of profile image */}
        <div
          style={{
            width: '100px',
            height: '100px',
            minWidth: '100px',
            borderRadius: '50%',
            background: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '55px',
            fontWeight: 'bold',
            color: '#222',
          }}
        >
          {initial}
        </div>

        <div style={{ minWidth: 0 }}>
          <h1 style={{ margin: '0 0 8px', fontSize: '28px' }}>{resume.fullName || 'Your Name'}</h1>

          <p style={{ margin: 0, color: '#555' }}>{resume.title || 'Your Professional Title'}</p>
        </div>
      </div>

      {/* Two-column sections */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '25px',
        }}
      >
        {/* Left column */}
        <div>
          <section style={sectionStyle}>
            <h2 style={headingStyle}>Education</h2>

            <div
              style={contentStyle}
              dangerouslySetInnerHTML={renderHtml(resume.education, 'Your education details')}
            />
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>Experience</h2>

            <div
              style={contentStyle}
              dangerouslySetInnerHTML={renderHtml(resume.experience, 'Your work experience')}
            />
          </section>
        </div>

        {/* Right column */}
        <div
          style={{
            borderLeft: '1px solid #ddd',
            paddingLeft: '20px',
            minWidth: 0,
          }}
        >
          <section style={sectionStyle}>
            <h2 style={headingStyle}>Professional Summary</h2>

            <div
              style={contentStyle}
              dangerouslySetInnerHTML={renderHtml(
                resume.summary,
                `<p>I&nbsp;am&nbsp;a&nbsp;MERN&nbsp;stack&nbsp;developer,&nbsp;currently&nbsp;doing&nbsp;an&nbsp;internship&nbsp;at&nbsp;JC&nbsp;Software&nbsp;Solution&nbsp;Mohali.&nbsp;During&nbsp;my&nbsp;internship,&nbsp;I&nbsp;am&nbsp;learning&nbsp;React,&nbsp;Express,&nbsp;Bootstrap,&nbsp;and&nbsp;Tailwind.</p>`,
              )}
            />
          </section>

          <section style={sectionStyle}>
            <h2 style={headingStyle}>Skills</h2>

            <div
              style={contentStyle}
              dangerouslySetInnerHTML={renderHtml(resume.skills, 'Your skills')}
            />
          </section>

          {/* Custom sections */}
          {(resume.customSections || []).map((section) => (
            <section key={section.id} style={sectionStyle}>
              <h2 style={headingStyle}>{section.title || 'Additional Section'}</h2>

              <div style={contentStyle} dangerouslySetInnerHTML={renderHtml(section.content)} />
            </section>
          ))}
        </div>
      </div>

      {/* Contact footer */}
      <div
        style={{
          borderTop: '1px solid #ccc',
          paddingTop: '15px',
          marginTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          fontSize: '13px',
        }}
      >
        <span>Email: {resume.email || 'Your email'}</span>
        <span>Phone: {resume.phone || 'Your phone'}</span>
        <span>Address: {resume.address || 'Your address'}</span>
      </div>
    </div>
  );
}
