<template>
    <nav class="navbar navbar-expand-lg navbar-light bg-white px-4">
        <div class="d-flex align-items-center">
            <a class="navbar-brand d-flex align-items-center" href="/">
                <img src="@/assets/img/logo.png" alt="Logo" height="40" />
                <span class="ms-2 h4 mb-0 fw-bold text-success system-name">Fumigations System</span>
            </a>
        </div>
        <div class="collapse navbar-collapse justify-content-end">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        ¿Quiénes Somos?
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#mision">Misión</a></li>
                        <li><a class="dropdown-item" href="#vision">Visión</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/login">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="https://wa.me/502XXXXXXXX" target="_blank">Soporte</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>
.system-name {
    letter-spacing: 2px;
}
</style>