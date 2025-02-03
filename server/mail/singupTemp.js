export const registrationSuccessTemplate = (firstName) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>Welcome to JobHunt!</title>
		<style>
			body {
				background-color: #f9f9f9;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.6;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 20px auto;
				padding: 20px;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				text-align: center;
			}
	
			.logo {
				max-width: 150px;
				margin-bottom: 20px;
			}
	
			.header {
				font-size: 22px;
				font-weight: bold;
				color: #007BFF;
				margin-bottom: 15px;
			}
	
			.body {
				text-align: left;
				font-size: 16px;
				color: #555555;
				margin-bottom: 20px;
				line-height: 1.8;
			}
	
			.list {
				text-align: left;
				margin: 10px 0;
				padding-left: 20px;
				color: #333333;
			}
	
			.footer {
				font-size: 14px;
				color: #999999;
				margin-top: 30px;
			}
		</style>
	</head>
	
	<body>
		<div class="container">
			<a href="https://jobhunt.vercel.app"><img class="logo"
					src="https://drive.google.com/file/d/1L3iLshKpT_vriu3C-L-H_mfozPG7ehYl/view?usp=sharing" alt="JobHunt Logo"></a>
			<div class="header">Welcome to JobHunt, ${firstName}! 🎉</div>
			<div class="body">
				<p>Thank you for registering on <strong>JobHunt</strong>, your go-to platform for connecting job seekers with recruiters!</p>
				<p>Happy to have you on board. Here’s what you can do next:</p>
				<ul class="list">
					<li><strong>Build Your Profile:</strong> Showcase your skills, upload your resume, and let recruiters know what makes you unique.</li>
					<li><strong>Explore Opportunities:</strong> Browse through our diverse job listings tailored just for you.</li>
					<li><strong>Stay Ahead:</strong> Track your applications, and get notified about updates and exciting new opportunities.</li>
				</ul>
				<p><strong>Tip:</strong> A complete profile increases your chances of getting noticed by recruiters.</p>
				<p>If you have any questions or need assistance, feel free to reach out to us at <a href="mailto:support@jobhunt.com">support@jobhunt.com</a>.</p>
				<p>Welcome to the JobHunt family – let’s get you one step closer to your dream career!</p>
			</div>
			<div class="footer">
				<p>Warm regards,</p>
				<p><strong>The JobHunt Team</strong></p>
				<a href="https://jobhunt.vercel.app">Visit JobHunt</a>
			</div>
		</div>
	</body>
	
	</html>`;
};
