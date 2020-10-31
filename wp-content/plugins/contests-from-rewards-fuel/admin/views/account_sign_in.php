<div class="rf-loader account-loader hidden"><img src='https://cdn.rewardsfuel.com/assets/images/wl_loader.svg'></div>
<div class="sign_in_area">
<ul class="nav nav-pills text-left mb-4" id="account-pills" role="tablist">
	<li class="nav-item mr-3">
		<a class="nav-link active pl-4 pr-4" id="pills-home-tab" data-toggle="pill" href="#sign-up" role="tab" aria-controls="pills-home" aria-selected="true">Sign up</a>
	</li>
	<li class="nav-item">
		<a class="nav-link btn-outline-primary  pl-4 pr-4" id="pills-profile-tab" data-toggle="pill" href="#sign-in" role="tab" aria-controls="pills-profile" aria-selected="false">Sign in</a>
	</li>
</ul>
<div class="tab-content" id="pills-tabContent">
	<div class="tab-pane fade show active" id="sign-up" role="tabpanel">
		<form class="text-center border border-rf p-5" id="rf-sign-up-form">
			<div class="form-row mb-2">
				<div class="col">
					<!-- First name -->
					<input type="text" name="first_name"  required minlength="2" class="form-control" placeholder="First name">
				</div>
				<div class="col">
					<!-- Last name -->
					<input type="text"  name="last_name"  required minlength="2" class="form-control" placeholder="Last name">
				</div>
			</div>

			<!-- E-mail -->
			<input type="email" name="email" id="email-sign-up" required class="form-control mb-4" placeholder="email">

			<!-- Password -->
			<input type="password" required name="pass" class="form-control" placeholder="password"
			    minlength="8">
			<small id="defaultRegisterFormPasswordHelpBlock" class="form-text text-muted mb-4">
				At least 8 characters
			</small>

			<button class="btn btn-primary my-4 btn-block" type="submit">Sign up</button>

			<!-- Social register -->
			<p>or sign up with:</p>

			<a href="#" class="mx-1 rf-sign-in-google" role="button"><i class="fab fa-google"></i></a>
			<a href="#" class="mx-1  rf-sign-in-twitter" role="button"><i class="fab fa-twitter"></i></a>

			<hr>


		</form>
	</div>
	<div class="tab-pane fade" id="sign-in" role="tabpanel">

		<form class="text-center border border-rf  p-5" id="rf-sign-in-form">
			<input type="email"  id="email-sign-in" name="email"  required class="form-control mb-4" placeholder="email">
			<input type="password" name="password"  required class="form-control mb-4" placeholder="password">
			<div class="d-block p1">
					<a href="#" class="rf-forgot-pass">Forgot password?</a>
			</div>

			<!-- Sign in button -->
			<button class="btn btn-primary btn-block my-4" type="submit">Sign in</button>

			<!-- Register -->
			<p>Not a member?
				<a href="#" class="change-to-sign-up">Sign up</a>
			</p>

			<p>or sign in with:</p>
			<a href="#" class="mx-1 rf-sign-in-google" role="button"><i class="fab fa-google"></i></a>
			<a href="#" class="mx-1  rf-sign-in-twitter" role="button"><i class="fab fa-twitter"></i></a>
		</form>





	</div>
</div>
</div>
