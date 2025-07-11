package es.uah.pablopinas.tfg.auth_service.application.port.in;

import es.uah.pablopinas.tfg.auth_service.domain.model.User;

public interface RegisterUseCase {
    /**
     * Registers a new user in the system.
     *
     * @param user The user to register, containing the necessary details such as email, password, and provider.
     *             The password should be hashed before passing it to this method.
     *             If the user already exists, an exception will be thrown.
     * @return The registered users
     */
    User registerUser(User user);
}
