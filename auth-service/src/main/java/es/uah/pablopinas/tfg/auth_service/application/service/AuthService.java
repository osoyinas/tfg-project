package es.uah.pablopinas.tfg.auth_service.application.service;

import es.uah.pablopinas.tfg.auth_service.application.port.in.AuthenticationUseCase;
import es.uah.pablopinas.tfg.auth_service.application.port.in.RegisterUseCase;
import es.uah.pablopinas.tfg.auth_service.application.port.in.AuthTokens;
import es.uah.pablopinas.tfg.auth_service.application.port.out.LoadUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.SaveUserPort;
import es.uah.pablopinas.tfg.auth_service.application.port.out.TokenPort;
import es.uah.pablopinas.tfg.auth_service.domain.exception.InvalidCredentialsException;
import es.uah.pablopinas.tfg.auth_service.domain.exception.UserAlreadyExistsException;
import es.uah.pablopinas.tfg.auth_service.domain.model.Provider;
import es.uah.pablopinas.tfg.auth_service.domain.model.Role;
import es.uah.pablopinas.tfg.auth_service.domain.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

/**
 * Service implementing authentication and user registration use cases.
 * <p>
 * This service handles user login with email and password,
 * and new user registration, delegating to appropriate outbound ports.
 */
@RequiredArgsConstructor
public class AuthService implements AuthenticationUseCase, RegisterUseCase {

    private final LoadUserPort loadUserPort;
    private final SaveUserPort saveUserPort;
    private final TokenPort tokenPort;
    private final PasswordEncoder passwordEncoder;

    /**
     * Logs in a user by verifying email and password credentials.
     * If successful, returns access and refresh tokens.
     *
     * @param email    the user's email address
     * @param password the user's raw password
     * @return {@link AuthTokens} containing access and refresh tokens
     * @throws InvalidCredentialsException if the credentials are invalid
     */
    @Override
    public AuthTokens loginWithEmailAndPassword(String email, String password) {
        User user = loadUserPort.loadUserByEmail(email).orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        return tokenPort.generateTokens(user);
    }

    /**
     * Registers a new user with the given information.
     * The password is hashed before saving.
     *
     * @param user the user to register
     * @return the newly created {@link User}
     * @throws UserAlreadyExistsException if a user with the same email already exists
     */
    @Override
    public User registerUser(User user) {
        loadUserPort.loadUserByEmail(user.getEmail()).ifPresent(existing -> {
            throw new UserAlreadyExistsException(user.getEmail());
        });

        String hashedPassword = passwordEncoder.encode(user.getPasswordHash());

        User userToSave = User.builder().id(UUID.randomUUID()).email(user.getEmail()).passwordHash(hashedPassword).provider(Provider.LOCAL).role(Role.USER).build();

        return saveUserPort.saveUser(userToSave);
    }
}
