import '../style/navbar.css';

import NavLogin from './navlogin';

export default function Navbar(props) {
	return (
		<nav class="navbar navbar-expand-sm navbar-dark bg-dark" style={{ zIndex: '100' }}>
			<div class="container">
				<span class="navbar-brand" style={{ textTransform: 'uppercase' }}>
					<img src={props.image ?? 'https://cdn.discordapp.com/avatars/909870067053887539/663f62a43435aa9ef023ebdd2ecb4483.png'} alt='' />
					{props.value}
				</span>
				{/* {props.loading | !props.user ?
					undefined :
					(
						<div class="collapse navbar-collapse" id="navbarNav">
							<ul class="navbar-nav">
								<li class="nav-item">
									<a class="nav-link active" href="https://appeal.siren.community">Appeal</a>
								</li>
								<li class="nav-item">
									<a class="nav-link" href="https://dates.siren.community">Dates</a>
								</li>
							</ul>
						</div>
					)
				} */}
				{props.loading ?
					undefined :
					(
						<ul class="navbar-nav">
							<li class="nav-item">
								<span class="nav-link">
									<NavLogin user={props.user} />
								</span>
							</li>
						</ul>
					)
				}
			</div>
		</nav>
	);
}