export default (content: string, title: string = 'Webstrap') =>
`\
<!DOCTYPE html>
<html>
	<head>
		<title>${title}</title>
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="/assets/main.css">
	</head>
	<body>
		${content}
		<script src="https://unpkg.com/jquery@3.3.1/dist/jquery.js"></script>
		<script src="https://unpkg.com/react@16/umd/react.development.js" crossorigin></script>
		<script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js" crossorigin></script>
		<script src="/assets/bundle.js"></script>
	</body>
</html>
`
