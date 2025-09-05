export function LogoImage() {
	return (
		<svg
			width='86'
			height='86'
			xmlns='http://www.w3.org/2000/svg'
			viewBox='0 0 400 400'
		>
			<filter id='glow' x='-50%' y='-50%' width='200%' height='200%'>
				<feGaussianBlur stdDeviation='8' result='blur' />
				<feMerge>
					<feMergeNode in='blur' />
					<feMergeNode in='SourceGraphic' />
				</feMerge>
			</filter>

			<path
				d='M100 130 Q200 40 300 130 Q310 200 300 250 Q200 300 100 250 Q90 200 100 130Z'
				stroke='#b84dff'
				stroke-width='6'
				fill='none'
				filter='url(#glow)'
			/>

			<polygon
				points='190,160 240,190 190,220'
				fill='#ff4444'
				filter='url(#glow)'
			/>

			<text
				x='200'
				y='340'
				text-anchor='middle'
				font-family='Arial, sans-serif'
				font-weight='bold'
				font-size='80'
				fill='white'
				stroke='#b84dff'
				stroke-width='2'
				filter='url(#glow)'
			>
				CRIX
			</text>
		</svg>
	)
}
