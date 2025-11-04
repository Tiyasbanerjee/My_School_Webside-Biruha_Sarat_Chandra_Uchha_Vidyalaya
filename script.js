document.addEventListener('DOMContentLoaded', () => {
	const loading1 = document.getElementById('loading1');
	const loading2 = document.getElementById('loading2');
	const school1 = document.getElementById('school_1');
	const holoCheckbox = document.getElementById('holo-check');

	let activationInterval = null;
	let powerLevel = 0;
	let cpuUsage = 0;
	let powerMaxed = false;
	let cpuMaxed = false;
	let navigationTimeout = null;

	function display(wh){
		try {
			if (wh === 1) {
				// Show loading1
				if (loading1) loading1.style.display = 'flex';
				if (loading2) loading2.style.display = 'none';
				if (school1) school1.style.display = 'none';
				console.log('Showing loading1');
			} else if (wh === 2) {
				// Show loading2
				if (loading1) loading1.style.display = 'none';
				if (loading2) loading2.style.display = 'flex';
				if (school1) school1.style.display = 'none';
				console.log('Showing loading2');
			} else if (wh === 3) {
				// Show school1 (main page)
				if (loading1) loading1.style.display = 'none';
				if (loading2) loading2.style.display = 'none';
				if (school1) school1.style.display = 'flex';
				console.log('Showing school1');
			}
		} catch (err) {
			console.error('display error', err);
		}
	}

	function getRandomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function updateActivationSequence() {
		const powerElement = document.getElementById('power-level');
		const cpuElement = document.getElementById('cpu-usage');

		// Update power level
		if (!powerMaxed) {
			const powerIncrease = getRandomNumber(1, 15);
			powerLevel = Math.min(powerLevel + powerIncrease, 100);

			if (powerLevel >= 100) {
				powerLevel = 100;
				powerMaxed = true;
				powerElement.classList.add('max');
			}
			powerElement.textContent = powerLevel;
		}

		// Update CPU usage
		if (!cpuMaxed) {
			const cpuChange = getRandomNumber(-10, 10);
			cpuUsage = Math.max(0, Math.min(cpuUsage + cpuChange, 100));

			if (cpuUsage >= 100) {
				cpuUsage = 100;
				cpuMaxed = true;
				cpuElement.classList.add('max');
			}
			cpuElement.textContent = cpuUsage;
		}

		// Stop updating if both are maxed
		if (powerMaxed && cpuMaxed) {
			clearInterval(activationInterval);
			console.log('Activation sequence complete');
		}
	}

	function startActivationSequence() {
		powerLevel = 0;
		cpuUsage = 0;
		powerMaxed = false;
		cpuMaxed = false;

		const powerElement = document.getElementById('power-level');
		const cpuElement = document.getElementById('cpu-usage');
		powerElement.classList.remove('max');
		cpuElement.classList.remove('max');

		activationInterval = setInterval(updateActivationSequence, 300);

		// Start 5-second countdown to navigate to main page
		navigationTimeout = setTimeout(() => {
			console.log('5 seconds passed, navigating to main page...');
			display(3);
		}, 5000);
	}

	// Initial sequence: Show loading1 for 3 seconds
	display(1);
	
	setTimeout(() => {
		// After 3 seconds, show loading2
		display(2);
		console.log('Switched to loading2, waiting for button press...');
	}, 3000);

	// Listen for holo-checkbox activation
	if (holoCheckbox) {
		holoCheckbox.addEventListener('change', (e) => {
			if (e.target.checked) {
				console.log('System activated, starting activation sequence...');
				startActivationSequence();
			} else {
				// If unchecked, clear the timeout
				if (navigationTimeout) {
					clearTimeout(navigationTimeout);
				}
				if (activationInterval) {
					clearInterval(activationInterval);
				}
			}
		});
	}

	// Optional: intercept same-origin link clicks
	document.addEventListener('click', (e) => {
		const a = e.target && e.target.closest ? e.target.closest('a') : null;
		if (!a) return;
		if (a.target === '_blank' || a.hasAttribute('download')) return;
		try {
			const url = new URL(a.href, location.href);
			if (url.origin !== location.origin) return;
		} catch {
			return;
		}
		e.preventDefault();
		display(2);
		setTimeout(() => { location.href = a.href; }, 150);
	});
});


